import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { data } from '../constants/data'
import { theme } from '../constants/theme'
import { hp, wp } from '../helpers/common'
import Animated, { FadeInRight } from 'react-native-reanimated'

const Categories = ({activeCategory, handleChangeCategory}) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      data={data.categories}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          isActive={activeCategory === item}
          handleChangeCategory={handleChangeCategory}
          title={item}
        />
      )}
    />
  )
}

const CategoryItem = ({ title, index, isActive, handleChangeCategory }) => {
  // Adjust the color and backgroundColor depending on the active state
  let color = isActive ? theme.colors.white : theme.colors.black; // Set inactive text color to black explicitly
  let backgroundColor = isActive ? theme.colors.black : theme.colors.white; // Set the active background color to black

  return (
    <Animated.View entering={FadeInRight.delay(index*200).duration(1000).springify().damping(14)}>

    <Pressable
      onPress={() => handleChangeCategory(isActive ? null : title)}
      style={[styles.category, { backgroundColor }]}
    >
      <Text style={[styles.title, { color }]}>{title}</Text>
    </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 100,
    backgroundColor: 'white',
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontweights.medium,
  },
});

export default Categories;
