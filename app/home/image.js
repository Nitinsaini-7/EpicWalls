import { View, Text, StyleSheet, Image, Platform, ActivityIndicator, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { hp, wp } from '../../helpers/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { Octicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';

const ImageScreen = () => {
    const router = useRouter();
    const item = useLocalSearchParams();
    const uri = item?.webformatURL;
    const [status, setStatus] = useState('Loading');
    const fileName = item?.previewURL?.split('/').pop();
    const imageUrl = uri;
    const filepath = `${FileSystem.documentDirectory}${fileName}`;

    useEffect(() => {
        if (Platform.OS === 'android') {
            requestPermissions();
        }
    }, []);

    const requestPermissions = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Storage permission is required to download images.');
        }
    };

    const getSize = () => {
        const aspectRatio = item?.imageWidth / item?.imageHeight;
        const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
        const calculatedHeight = maxWidth / aspectRatio;
        const calculatedWidth = aspectRatio < 1 ? calculatedHeight * aspectRatio : maxWidth;

        return {
            width: calculatedWidth,
            height: calculatedHeight
        };
    };

    const onLoad = () => {
        setStatus('');
    };

    const handleDownloadImage = async () => {
        setStatus('downloading');
        const uri = await downloadFile();
        if (uri) {
            await saveToDevice(uri);
            showToast('Image Downloaded');
        } else {
            showToast('Failed to download image');
        }
    };

    const saveToDevice = async (fileUri) => {
        if (Platform.OS === 'android') {
            try {
                await MediaLibrary.saveToLibraryAsync(fileUri);
            } catch (error) {
                Alert.alert('Save Error', 'Could not save the image to the gallery.');
            }
        }
    };

    const handleShareImage = async () => {
        setStatus('sharing');
        const uri = await downloadFile();
        if (uri) {
            await Sharing.shareAsync(uri);
        }
    };

    const downloadFile = async () => {
        try {
            const { uri: localUri } = await FileSystem.downloadAsync(imageUrl, filepath);
            setStatus('');
            console.log('Downloaded to:', localUri);
            return localUri;
        } catch (error) {
            console.log('Download error:', error.message);
            setStatus('');
            Alert.alert('Download Error', error.message);
            return null;
        }
    };

    const showToast = (message) => {
        Toast.show({
            type: 'success',
            text1: message,
            position: 'bottom'
        });
    };

    const toastConfig = {
        success: ({ text1 }) => (
            <View style={styles.toast}>
                <Text style={styles.toastText}>{text1}</Text>
            </View>
        ),
    };

    return (
        <View style={styles.container}>
            <BlurView style={styles.blurView} tint="dark" intensity={Platform.OS === 'ios' ? 60 : 100}>
                <View style={getSize()}>
                    <View style={styles.loading}>
                        {status === 'Loading' && <ActivityIndicator size="large" color="white" />}
                    </View>
                    <Image
                        transition={100}
                        style={[styles.image, getSize()]}
                        source={{ uri }}
                        onLoad={onLoad}
                    />
                </View>
                <View style={styles.buttons}>
                    <Animated.View entering={FadeInDown.springify()}>
                        <Pressable style={styles.button} onPress={() => router.back()}>
                            <Octicons name="x" size={24} color="white" />
                        </Pressable>
                    </Animated.View>

                    <Animated.View entering={FadeInDown.springify().delay(100)}>
                        {status === 'downloading' ? (
                            <View style={styles.button}>
                                <ActivityIndicator size="small" color="white" />
                            </View>
                        ) : (
                            <Pressable style={styles.button} onPress={handleDownloadImage}>
                                <Octicons name="download" size={24} color="white" />
                            </Pressable>
                        )}
                    </Animated.View>

                    <Animated.View entering={FadeInDown.springify().delay(200)}>
                        {status === 'sharing' ? (
                            <View style={styles.button}>
                                <ActivityIndicator size="small" color="white" />
                            </View>
                        ) : (
                            <Pressable style={styles.button} onPress={handleShareImage}>
                                <Octicons name="share" size={24} color="white" />
                            </Pressable>
                        )}
                    </Animated.View>
                </View>
            </BlurView>
            <Toast config={toastConfig} visibilityTime={2500} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.7)' : 'transparent',
    },
    blurView: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        backgroundColor: Platform.OS === 'android' ? 'rgba(0,0,0,0.5)' : 'transparent',
    },
    image: {
        borderRadius: theme.radius.lg,
        borderWidth: 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderColor: 'rgba(255,255,255,0.1)',
    },
    loading: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 50,
    },
    button: {
        height: hp(6),
        width: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 100,
    },
    toast: {
        padding: 15,
        paddingHorizontal: 30,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    toastText: {
        fontSize: hp(1.8),
        fontWeight: theme.fontweights.semibold,
        color: theme.colors.white,
    },
});

export default ImageScreen;
