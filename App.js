import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, Button } from 'react-native';
import Header from './components/header';
import { HCESession, NFCTagType4NDEFContentType, NFCTagType4 } from 'react-native-hce';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';

export default function App() {

  const [toggle, setToggle] = useState(true);
  const [toggleRead, setToggleRead] = useState(true);

  let session;

  const stopSession = async () => {
    session = await HCESession.getInstance();
    await session.setEnabled(false);
    setToggle(true);
    console.log('NFC Send Stop')
  }

  const startSession = async () => {
    const tag = new NFCTagType4({
      type: NFCTagType4NDEFContentType.Text,
      // content: "Hello world",
      content: "NAME:John,AGE:20,CITY:Texas",
      writable: false
    });

    session = await HCESession.getInstance();
    session.setApplication(tag);
    await session.setEnabled(true);
    Alert.alert('Notice', 'NFC Send enabled!');
    setToggle(toggle => !toggle);
    console.log('NFC Send Start')
    listen()

  }

  const listen = async () => {
    const removeListener = session.on(HCESession.Events.HCE_STATE_READ, () => {
      ToastAndroid.show("The tag has been read! Thank You.", ToastAndroid.LONG);
    });
  
    // to remove the listener:
    removeListener();
  }

  const readNdef = async () => {
    setToggleRead(toggleRead => !toggleRead);
    Alert.alert('Notice', 'NFC Scan enabled!');

    // Pre-step, call this before any NFC operations
    NfcManager.start();

    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      const ndefMsg = tag.ndefMessage;
      const content = Ndef.text.decodePayload(ndefMsg[0].payload);
      // Alert.alert('Tag found', content);

      // Split the string into an array of strings
      const dataArray = content.split(",");
  
      // Create a new object and assign values from the dataArray
      const dataObject = {};
      dataArray.forEach((data) => {
        const [key, value] = data.split(":");
        dataObject[key] = value;
      });
  
      Alert.alert('Tag found', dataObject);

    } catch (ex) {
      console.log('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      setToggleRead(true);
    }
  }

  const readNdefStop = async () => {
    NfcManager.cancelTechnologyRequest();
    NfcManager.stop();
    setToggleRead(true);
  }

  const Separator = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>
        <View style={styles.list}>
          {toggle?
            <Button title='Send' onPress={startSession}></Button>
          :
            <Button title='Stop' color="red" onPress={stopSession}></Button>
          }
          <Separator/>

          {toggleRead?
            <Button title='Receive' color="green" onPress={readNdef}></Button>
            :
            <Button title='Cancel' color="red" onPress={readNdefStop}></Button>
          }
          <Separator/>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 30,
    flex: 1,
  },
  list: {
    marginTop: 20,
    flex: 1,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});