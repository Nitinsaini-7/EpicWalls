import { View, Text, StyleSheet, Pressable } from "react-native";
import React, { useMemo } from "react";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { BlurView } from "expo-blur";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { theme } from "../constants/theme";
import { capitalize, hp } from '../helpers/common'
import SectionView, { ColorFilter, CommonFilterRow } from "./filterView";
import { data } from "../constants/data";

// import { AnimatedView } from "react-native-reanimated/lib/typescript/reanimated2/component/View";

const FilterModel = ({ 
  modalRef,
  onClose,
  onApply,
  onReset,
  filters,
  setFilters

 }) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enableDismissOnClose={true}
      backdropComponent={CustomBackrop}
      //   onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
            {
              Object.keys(sections).map((sectionName, index)=>{
                let sectionView = sections[sectionName];
                let sectionData = data.filters[sectionName];
                let title = capitalize(sectionName);
                return (
                  <Animated.View
                    entering={FadeInDown.delay((index*100)+100).springify().damping(11)}
                    key={sectionName}>
                    <SectionView
                      title={title}
                      content={sectionView({
                        data:sectionData,
                        filters,
                        setFilters,
                        filterName:sectionName
                      })}
                    />
                  </Animated.View>
                )
              })
            }

            {/* action */}
            <Animated.View 
              style={styles.buttons}
              entering={FadeInDown.delay(500).springify().damping(11)}
            >
              <Pressable style={styles.resetButton} onPress={onReset}>
                <Text style={[styles.buttonText, {color:theme.colors.black}]}>Reset</Text>
              </Pressable>

              <Pressable style={styles.applyButton} onPress={onApply}>
                <Text style={[styles.buttonText, {color:theme.colors.white}]}>Apply</Text>
              </Pressable>
            </Animated.View>

          </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections = {
  'order': (props)=><CommonFilterRow {...props}/>,
  'orientation': (props)=><CommonFilterRow {...props}/>,
  'type': (props)=><CommonFilterRow {...props}/>,
  'colors': (props)=><ColorFilter {...props}/>
}




const CustomBackrop = ({ animatedIndex, style }) => {
  const containerAnimatedStyle = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
    };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerAnimatedStyle,
  ];

  return (
    <Animated.View style={containerStyle}>
      {/* blur view */}
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
 
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content:{
    flex:1,
    gap:15,
    paddingVertical:10,
    paddingHorizontal:20,
    width:'100%'
    
  },
  filterText:{
    fontSize:hp(4),
    fontWeight:theme.fontweights.semibold,
    color:theme.colors.neutral(0.8),
    marginBottom:5
  },
  buttons:{
    // flex:1,
    flexDirection:'row',
    alignItems:'center',
    gap:10
  },
  applyButton:{
    flex:1,
    backgroundColor:theme.colors.black,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
    borderCurve:'continuous',
    padding:10
  },
   resetButton:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:100,
    borderCurve:'continuous',
    padding:10,
    borderWidth:2,
  },
  buttonText:{
    fontSize:hp(2)
  }
});

export default FilterModel;
