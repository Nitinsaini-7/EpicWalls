import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./imageCard";
import { wp } from "../helpers/common";
import { getColumnCount } from "../helpers/common";
// import { getConstantValue } from "typescript";

const ImageGrid = ({images, router}) => {

    const columns = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        renderItem={({ item, index }) => <ImageCard router={router} item={item} columns={columns} index={index}/>}
        estimatedItemSize={200}
        contentContainerStyle={styles.listContainerStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container:{
        minHeight:3,
        width:wp(100)
    },

    listContainerStyle:{
        paddingHorizontal:wp(4)
    }
})

export default ImageGrid;
