import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { capitalize, hp } from '../helpers/common'
import { theme } from '../constants/theme'

const SectionView = ({title, content}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>
        {content}
      </View>
    </View>
  )
}

export const CommonFilterRow = ({data, filterName, filters, setFilters})=>{

    const onSelect = (item)=>{
        setFilters({...filters, [filterName]:item})
    }

    return(
      <View style={styles.flexRowWrap}>
        {
            data && data.map((item, index)=>{
                let isActive = filters && filters[filterName] == item;
                let backgroundColor = isActive ? theme.colors.black : 'white';
                let color = isActive ? 'white' : theme.colors.black
                return(
                    <Pressable key={item}
                        style={[styles.outlinedButton, {backgroundColor}]}
                        onPress={()=>onSelect(item)}
                    >
                        <Text style={[styles.outlinedButtonText, {color}]}>{capitalize(item)}</Text>
                    </Pressable>
                )
            })
        }
      </View>
    )
  }


export const ColorFilter = ({data, filterName, filters, setFilters})=>{

    const onSelect = (item)=>{
        setFilters({...filters, [filterName]:item})
    }

    return(
      <View style={styles.flexRowWrap}>
        {
            data && data.map((item, index)=>{
                let isActive = filters && filters[filterName] == item;
                let borderColor = isActive ? item : 'white';
                return(
                    <Pressable key={item}
                        
                        onPress={()=>onSelect(item)}
                    >
                        <View style={[styles.colorWrapper, {borderColor}]}>
                            <Text style={[styles.color, {backgroundColor:item}]}></Text>
                        </View>
                       
                    </Pressable>
                )
            })
        }
      </View>
    )
  }

const styles = StyleSheet.create({
    sectionContainer:{
        gap:8
    },
    sectionTitle:{
        fontSize:hp(2.4),
        fontWeight:theme.fontweights.medium,
        color:theme.colors.neutral(0.8)
    },
    flexRowWrap:{
        gap:10,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    outlinedButton:{
        padding:8,
        paddingHorizontal:14,
        borderWidth:1,
        borderColor:theme.colors.gray,
        borderRadius:100,
        borderCurve:'continuous'
    },
    outlinedButtonText:{

    },
    colorWrapper:{
        padding:3,
        borderRadius:100,
        borderWidth:2,
        borderCurve:'continuous'
    },
    color:{
        height:40,
        width:40,
        borderRadius:100,
        borderCurve:'continuous'
    }
})

export default SectionView