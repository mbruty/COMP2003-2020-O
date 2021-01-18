import React, { useState } from "react";
import Slider from '@react-native-community/slider';
import {Text, View, Button, Modal, Alert, StyleSheet, TouchableOpacity} from "react-native";
import { CONSTANT_STYLES, CONSTANT_COLOURS } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";

const Settings: React.FC = () => {
  const [modalVisiblePassword, setModalVisiblePassword] = useState(false);
  const [modalVisibleName, setModalVisibleName] = useState(false);
  
  return (
      <View>
        <Text style={styles.text}>Distance Preferences</Text>

        <Slider
          style={{height: 50}}
          minimumValue={1}
          maximumValue={10}
          step={0.5}
          minimumTrackTintColor="#FF0000"
          maximumTrackTintColor="#000000"
          thumbTintColor="#808080"
        />

        <Text style={styles.text}>Food Preferences</Text>
        <Button title={"Change Preferences"} onPress={()=>console.log('Food Preferences Clicked')}>Change Preferences</Button>

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



        <Text style={styles.text}>Account</Text>
        <Button title={"Change Nickname"} onPress={()=>setModalVisibleName(!modalVisibleName)}>Change Nickname</Button>
        <Button title={"Change Password"} onPress={()=>setModalVisiblePassword(!modalVisiblePassword)}>Change Password</Button>
        <Button title={"Log Out"} onPress={()=>console.log('Log out Pressed')}>Log Out</Button>
        <Button title={"Reset Preferences"} onPress={()=>console.log('Reset Pressed')}><style style={CONSTANT_STYLES.BG_RED}>Reset Account</style></Button>
        <Button title={"Delete Account"} onPress={()=>console.log('Delete Pressed')}><style style={CONSTANT_STYLES.BG_RED}>Delete Account</style></Button>


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
});

export default Settings;
