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
      content: "Hello world",
      writable: false
    });

    session = await HCESession.getInstance();
    session.setApplication(tag);
    await session.setEnabled(true);
    Alert.alert('Notice', 'NFC Send enabled!');
    setToggle(toggle => !toggle);
    console.log('NFC Send Start')
    listen

  }

  const listen = async () => {
    const removeListener = session.on(HCESession.Events.HCE_STATE_READ, () => {
      ToastAndroid.show("The tag has been read! Thank You.", ToastAndroid.LONG);
    });
  
    // to remove the listener:
    removeListener();
  }

  const readNdef = async () => {
    try{
      // Pre-step, call this before any NFC operations
      NfcManager.start();
    } catch (ex) {
      console.log('Oops!', ex);
    }

    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
      setToggleRead(toggleRead => !toggleRead);
    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      setToggleRead(true);
    }
  }

  const readNdefStop = async () => {
    NfcManager.cancelTechnologyRequest();
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
          {toggle?
            <Button title='Scan a Tag' color="green" onPress={readNdef}></Button>
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