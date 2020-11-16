import React, { useState } from "react";
import "./App.css";
import {Text, View, Button, Modal, Alert} from "react-native";
import { CONSTANT_STYLES } from "./shared/constants";
import ReactSlider from 'react-slider';
import { AwesomeTextInput } from "react-native-awesome-text-input";

function App(){
  const [modalVisiblePassword, setModalVisiblePassword] = useState(false);
  const [modalVisibleName, setModalVisibleName] = useState(false);
  return (
      <View>
        <Text style={CONSTANT_STYLES.BG_DARK_GREY}>Distance Preferences</Text>
        <ReactSlider
            className="horizontal-slider"
            marks
            markClassName="example-mark"
            min={1}
            max={20}
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        />

        <Text style={CONSTANT_STYLES.BG_DARK_GREY}>Food Preferences</Text>
        <Button title={"Change Preferences"} onPress={()=>console.log('Food Preferences Clicked')}>Change Preferences</Button>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisiblePassword}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
        >
          <View>
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
            <Button title={"Submit"} onPress={()=>console.log('Submit Pressed')}><style style={CONSTANT_STYLES.TXT_WHITE}>Submit</style></Button>
          </View>

        </Modal>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleName}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
        >
          <View>
            <Text>Change Password</Text>
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
            <Button title={"Submit"} onPress={()=>console.log('Submit Pressed')}><style style={CONSTANT_STYLES.TXT_WHITE}>Submit</style></Button>
          </View>

        </Modal>



        <Text style={CONSTANT_STYLES.BG_DARK_GREY}>Account</Text>
        <Button title={"Change Nickname"} onPress={()=>setModalVisibleName(!modalVisibleName)}>Change Nickname</Button>
        <Button title={"Change Password"} onPress={()=>setModalVisiblePassword(!modalVisiblePassword)}>Change Password</Button>
        <Button title={"Log Out"} onPress={()=>console.log('Log out Pressed')}>Log Out</Button>
        <Button title={"Reset"} onPress={()=>console.log('Reset Pressed')}><style style={CONSTANT_STYLES.BG_RED}>Reset Account</style></Button>
        <Button title={"Delete"} onPress={()=>console.log('Delete Pressed')}><style style={CONSTANT_STYLES.BG_RED}>Delete Account</style></Button>


      </View>
  );
}
