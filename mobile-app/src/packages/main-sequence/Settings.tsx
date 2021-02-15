import React, { useState } from "react";
import Slider from '@react-native-community/slider';
import {Text, View, Button, Modal, Alert, StyleSheet, TouchableOpacity} from "react-native";
import { CONSTANT_STYLES, CONSTANT_COLOURS } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";

const Settings: React.FC = () => {
  const [modalVisiblePassword, setModalVisiblePassword] = useState(false);
  const [modalVisibleName, setModalVisibleName] = useState(false);
  const [distance, setDistance] = useState(25);
  
  return (
      <View style={{paddingHorizontal: 25}}>
        <Text style={styles.title}>Distance Preferences</Text>
        <View style={styles.box}>
          <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
            <Text style={styles.text}>Maximum Distance:</Text>
            <Text style={styles.text}>{distance} miles</Text>
          </View>
          <Slider
          style={{height: 50}}
          minimumValue={1}
          maximumValue={100}
          value={distance}
          step={1}
          minimumTrackTintColor={CONSTANT_COLOURS.RED}
          maximumTrackTintColor="#AAAAAA"
          thumbTintColor={CONSTANT_COLOURS.RED}
          onValueChange={newValue => setDistance(newValue)}
        />
        </View>
        <View style={styles.spacer} />

        <Text style={styles.title}>Food Preferences</Text>
        <TouchableOpacity onPress={()=>console.log('Food Preferences Clicked')} style={styles.box}>
          <Text style={styles.text}>
          Change Preferences
          </Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisiblePassword}
            onRequestClose={() => {
              setModalVisiblePassword(false);
            }}
        >
          <View style={[styles.filledContainer]}>
            <Text>Change Password</Text>
            <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Previous Password"
            />
            <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="New Password"
            />
            <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Confirm Password"
            />
             <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
               setModalVisiblePassword(false)
               }}
              >
              <View style={[styles.btn]}>
                <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                   CANCEL
               </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => {
               setModalVisiblePassword(false)
               }}
              >
              <View style={[styles.btn]}>
                <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                   SUBMIT
               </Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>

        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleName}
            onRequestClose={() => {
              setModalVisibleName(false);
            }}
        >
          <View style={[styles.filledContainer]}>
            <Text>Change Nickname</Text>
            <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Previous Nickname"
            />
            <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="New Nickname"
            />
            <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Confirm Nickname"
            />
            <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
               setModalVisibleName(false)
               }}
              >
              <View style={[styles.btn]}>
                <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                   CANCEL
               </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
               setModalVisibleName(false)
               }}
              >
              <View style={[styles.btn]}>
                <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                   SUBMIT
               </Text>
              </View>
            </TouchableOpacity>
            </View>
          </View>

        </Modal>



        <Text style={styles.title}>Account</Text>
        <TouchableOpacity style={styles.box} onPress={()=>setModalVisibleName(!modalVisibleName)}>
          <Text style={styles.text}>Change Nickname</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={()=>setModalVisiblePassword(!modalVisibleName)}>
          <Text style={styles.text}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={()=>console.log('Log out Pressed')}>
          <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={()=>console.log('Reset Pressed')}>
          <Text style={styles.danger}>Reset Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.box} onPress={()=>console.log('Delete Pressed')}>
          <Text style={styles.danger}>Delete Account</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  filledContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,255)",
  },
  text: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  btn: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#369aff"
  },
  btnTxt: {
    textAlign: "center",
    fontSize: 16,
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
  },
  box: {
    backgroundColor: "white",
    width: "95%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 15
  },
  title: {
    fontWeight: "bold",
    marginTop: 15,
    color: CONSTANT_COLOURS.DARK_GREY,
    fontSize: 18
  },
  danger: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.RED,
    fontWeight: "bold",
    textTransform: "uppercase"
  },
  spacer: {
    width: "100%",
    marginTop: 20,
    height: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 2
  }
});

export default Settings;
