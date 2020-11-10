/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import Amplify, {Analytics} from 'aws-amplify';
import PushNotification from '@aws-amplify/pushnotification';

import Config from './aws-exports';
const awsConfig = {
  aws_cognito_identity_pool_id: Config.AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: Config.AWS_COGNITO_REGION,
  aws_mobile_analytics_app_id: Config.AWS_MOBILE_ANALYTICS_APP_ID,
  aws_mobile_analytics_app_region: Config.AWS_MOBILE_ANALYTICS_APP_REGION,
  aws_project_region: Config.AWS_PROJECT_REGION,
  oauth: {},
};

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import DeviceInfo from 'react-native-device-info';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

class App extends Component {
  async configure() {
    this.amplifyConfigure();
    PushNotification.configure(awsConfig);
    PushNotification.onRegister(async (token) => {
      await this.updateEndpoint({
        address: token,
      });
    });
    this.updateEndpoint({
      demographic: {
        appVersion: '1.2.3',
        locale: '',
        model: 'model',
        modelVersion: '',
        platform: 'Platform',
        // platformVersion: getPlatformVersion(),
        timezone: '',
      },
      // metrics: {dueDate},
      userAttributes: {
        type: 'type',
      },
      userId: 12345,
    });
  }
  constructor() {
    this.configure();
  }

  async updateEndpoint(endpointData) {
    console.log('Called updateEndpoint');
    try {
      const response = await Analytics.updateEndpoint(endpointData);
      console.log('response', response);
    } catch (e) {
      console.warn(
        'Unable to update Amplify endpoint for user:',
        endpointData.userId,
        e,
      );
    }
  }

  amplifyConfigure() {
    // BUG miss spelling FCM
    // const channelType = isAndroid() ? 'GCM' : 'APNS';
    const channelType = 'GCM';
    Amplify.configure({
      Analytics: {
        AWSPinpoint: {
          appId: awsConfig.aws_mobile_analytics_app_id,
          endpoint: {
            channelType,
          },
          endpointId: DeviceInfo.getUniqueId(),
          region: awsConfig.aws_mobile_analytics_app_region,
        },
      },
      Auth: {
        identityPoolId: awsConfig.aws_cognito_identity_pool_id,
        region: awsConfig.aws_cognito_region,
      },
    });
  }

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
            {global.HermesInternal == null ? null : (
              <View style={styles.engine}>
                <Text style={styles.footer}>Engine: Hermes</Text>
              </View>
            )}
            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Step One</Text>
                <Text style={styles.sectionDescription}>
                  Edit <Text style={styles.highlight}>App.js</Text> to change
                  this screen and then come back to see your edits.
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>See Your Changes</Text>
                <Text style={styles.sectionDescription}>
                  <ReloadInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Debug</Text>
                <Text style={styles.sectionDescription}>
                  <DebugInstructions />
                </Text>
              </View>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Learn More</Text>
                <Text style={styles.sectionDescription}>
                  Read the docs to discover what to do next:
                </Text>
              </View>
              <LearnMoreLinks />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
