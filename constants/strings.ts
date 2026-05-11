// M13.3 — UI strings in EN / HI / MR
// Usage: strings[language].someKey

type Language = 'en' | 'hi' | 'mr'

type StringSet = {
  appName: string
  tagline: string
  login: string
  sendOTP: string
  verifyOTP: string
  phoneNumber: string
  continueBtn: string
  skipForNow: string
  connectMT5: string
  mt5LoginId: string
  mt5Password: string
  mt5Server: string
  mt5ReadOnlyNote: string
  connectingAccount: string
  connectionSuccess: string
  noActiveTrades: string
  startStreak: string
  todayPnL: string
  winRate: string
  avgRR: string
  addReason: string
  howDidYouFeel: string
  whyThisTrade: string
  exitEmotion: string
  reflectionOptional: string
  saveAndContinue: string
  done: string
  stopForToday: string
  continueAnyway: string
  upgradeTitle: string
  upgradeBtn: string
  loading: string
  error: string
  retry: string
}

export const strings: Record<Language, StringSet> = {
  en: {
    appName: 'TradeLog',
    tagline: 'Your trades are already happening. Now they\'ll start teaching you.',
    login: 'Log In',
    sendOTP: 'Send OTP',
    verifyOTP: 'Verify OTP',
    phoneNumber: 'Phone Number',
    continueBtn: 'Continue',
    skipForNow: 'Skip for now',
    connectMT5: 'Connect MT5 Account',
    mt5LoginId: 'MT5 Login ID',
    mt5Password: 'Investor Password',
    mt5Server: 'Server (e.g. Dupoin-Live)',
    mt5ReadOnlyNote: 'Read-only access. We can see your trades. We cannot place, modify, or close any trade.',
    connectingAccount: 'Connecting account...',
    connectionSuccess: 'Account connected!',
    noActiveTrades: 'No active trades. Your next trade will appear here automatically.',
    startStreak: 'Start your streak',
    todayPnL: 'Today\'s P&L',
    winRate: 'Win Rate',
    avgRR: 'Avg RR',
    addReason: 'Add your reason',
    howDidYouFeel: 'How did you feel?',
    whyThisTrade: 'Why this trade?',
    exitEmotion: 'How did you exit?',
    reflectionOptional: 'Reflection (optional)',
    saveAndContinue: 'Save and continue trading',
    done: 'Done',
    stopForToday: 'Stop for today',
    continueAnyway: 'Continue anyway',
    upgradeTitle: 'Upgrade to Pro',
    upgradeBtn: 'Upgrade',
    loading: 'Loading...',
    error: 'Something went wrong',
    retry: 'Try again',
  },
  hi: {
    appName: 'TradeLog',
    tagline: 'आपकी ट्रेड्स पहले से हो रही हैं। अब वो आपको सिखाएंगी।',
    login: 'लॉग इन',
    sendOTP: 'OTP भेजें',
    verifyOTP: 'OTP वेरिफाई करें',
    phoneNumber: 'फोन नंबर',
    continueBtn: 'जारी रखें',
    skipForNow: 'अभी छोड़ें',
    connectMT5: 'MT5 अकाउंट कनेक्ट करें',
    mt5LoginId: 'MT5 लॉगिन ID',
    mt5Password: 'इन्वेस्टर पासवर्ड',
    mt5Server: 'सर्वर (जैसे Dupoin-Live)',
    mt5ReadOnlyNote: 'सिर्फ देखने की अनुमति। हम आपकी ट्रेड्स देख सकते हैं, लेकिन कोई ट्रेड नहीं लगा सकते।',
    connectingAccount: 'अकाउंट कनेक्ट हो रहा है...',
    connectionSuccess: 'अकाउंट कनेक्ट हो गया!',
    noActiveTrades: 'कोई एक्टिव ट्रेड नहीं। आपकी अगली ट्रेड यहाँ अपने आप दिखेगी।',
    startStreak: 'स्ट्रीक शुरू करें',
    todayPnL: 'आज का P&L',
    winRate: 'जीत की दर',
    avgRR: 'औसत RR',
    addReason: 'कारण लिखें',
    howDidYouFeel: 'आपने कैसा महसूस किया?',
    whyThisTrade: 'यह ट्रेड क्यों?',
    exitEmotion: 'आपने कैसे एग्जिट किया?',
    reflectionOptional: 'विचार (वैकल्पिक)',
    saveAndContinue: 'सेव करें और ट्रेडिंग जारी रखें',
    done: 'हो गया',
    stopForToday: 'आज के लिए बंद करें',
    continueAnyway: 'फिर भी जारी रखें',
    upgradeTitle: 'Pro में अपग्रेड करें',
    upgradeBtn: 'अपग्रेड करें',
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हो गया',
    retry: 'दोबारा कोशिश करें',
  },
  mr: {
    appName: 'TradeLog',
    tagline: 'तुमचे ट्रेड्स आधीच होत आहेत. आता ते तुम्हाला शिकवतील.',
    login: 'लॉग इन',
    sendOTP: 'OTP पाठवा',
    verifyOTP: 'OTP तपासा',
    phoneNumber: 'फोन नंबर',
    continueBtn: 'पुढे जा',
    skipForNow: 'आत्ता सोडा',
    connectMT5: 'MT5 खाते जोडा',
    mt5LoginId: 'MT5 लॉगिन ID',
    mt5Password: 'इन्व्हेस्टर पासवर्ड',
    mt5Server: 'सर्व्हर (उदा. Dupoin-Live)',
    mt5ReadOnlyNote: 'फक्त वाचण्याची परवानगी. आम्ही तुमचे ट्रेड्स पाहू शकतो, पण कोणताही ट्रेड लावू शकत नाही.',
    connectingAccount: 'खाते जोडले जात आहे...',
    connectionSuccess: 'खाते जोडले गेले!',
    noActiveTrades: 'सध्या कोणताही सक्रिय ट्रेड नाही. तुमचा पुढचा ट्रेड आपोआप येथे दिसेल.',
    startStreak: 'स्ट्रीक सुरू करा',
    todayPnL: 'आजचा P&L',
    winRate: 'जिंकण्याचा दर',
    avgRR: 'सरासरी RR',
    addReason: 'कारण लिहा',
    howDidYouFeel: 'तुम्हाला कसे वाटले?',
    whyThisTrade: 'हा ट्रेड का?',
    exitEmotion: 'तुम्ही कसे बाहेर पडलात?',
    reflectionOptional: 'विचार (पर्यायी)',
    saveAndContinue: 'सेव्ह करा आणि ट्रेडिंग सुरू ठेवा',
    done: 'झाले',
    stopForToday: 'आजसाठी थांबा',
    continueAnyway: 'तरी सुरू ठेवा',
    upgradeTitle: 'Pro मध्ये अपग्रेड करा',
    upgradeBtn: 'अपग्रेड करा',
    loading: 'लोड होत आहे...',
    error: 'काहीतरी चुकले',
    retry: 'पुन्हा प्रयत्न करा',
  },
}
