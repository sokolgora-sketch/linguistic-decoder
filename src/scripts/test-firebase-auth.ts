#!/usr/bin/env tsx

/**
 * A simple script to test Firebase anonymous authentication.
 * This confirms that the Firebase configuration and API keys are working correctly.
 */

import { config } from 'dotenv';
config(); // Load environment variables from .env file

// If you use tsconfig paths like "@/...", keep these two requires:
require("ts-node/register");
require("tsconfig-paths/register");

import { ensureAnon } from '@/lib/firebase';

async function testAuth() {
  console.log('Attempting to sign in anonymously to Firebase...');
  try {
    const user = await ensureAnon();
    if (user && user.uid) {
      console.log(`✅ Success! Signed in with UID: ${user.uid}`);
      console.log('Your Firebase API key and configuration are working correctly.');
    } else {
      console.error('❌ Failed! The user object was returned but was invalid.');
    }
  } catch (error) {
    console.error('❌ Authentication failed!');
    console.error('Error details:', error);
    console.log('\nPlease check the following:');
    console.log('1. Your .env file contains both NEXT_PUBLIC_FIREBASE_API_KEY and FIREBASE_SERVER_API_KEY.');
    console.log('2. The keys are correct and do not have any typos.');
    console.log('3. Anonymous sign-in is enabled in your Firebase Authentication console.');
    process.exit(1);
  }
}

testAuth();
