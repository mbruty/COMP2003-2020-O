import React from "react";
import {Alert, Button, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { CustomTextInput } from "./Login/CustomTextInput";
import {CONSTANT_STYLES} from "./constants";

interface Props {}

export const LogIn: React.FC<Props> = (props) => {
  // @ts-ignore
  const dimensions= Dimensions.get("window");
  const imageHeight=Math.round((dimensions.width*8)/13);
  const imageWidth=dimensions.width;

  const styles = StyleSheet.create({
    ImageStyle:{
      height:imageHeight,
      width:imageWidth,
    }

  })


  return (
    <>
      <View style={{
        top:-175,
        backgroundColor:'white'
      }}>
        <Image style={styles.ImageStyle} source={require('./log-in.png')}/>
      </View>


      <View style={{
        position:"absolute",
        top: 200,
        borderRadius:40,
        backgroundColor:'white',
        borderWidth:50,
        borderColor:'white'
      }}>

        <Text style={{fontWeight:"bold" , color:'red' , fontSize:24 , paddingBottom:15 , paddingTop:10 , textAlign: 'center'}}>Track and Taste</Text>


        <CustomTextInput label="Email" isPassword={false} />
        <CustomTextInput label="Password" isPassword={true} />


        <TouchableOpacity>
          <Text style={{color:'firebrick' , fontSize:12 , textAlign: "right" , paddingBottom:15}}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button title={"Log In"} onPress={console.clear} color={'red'}>Log In</Button>


        <Text style={{color:"gainsboro" , paddingTop:15}}>
          Don't have an account?
          <TouchableOpacity>
            <Text style={{color:"firebrick" , textAlign: "right"}}> Sign Up</Text>
          </TouchableOpacity>
        </Text>
      </View>


    </>
  );
};