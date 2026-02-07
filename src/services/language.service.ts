import { Injectable, signal, computed, effect } from '@angular/core';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    'nav.explore': 'Explore',
    'nav.history': 'History',
    'nav.logout': 'Logout',
    'auth.welcome': 'Welcome back',
    'auth.signin_subtitle': 'Sign in to continue learning',
    'auth.email': 'Email address',
    'auth.password': 'Password',
    'auth.signin_btn': 'Sign in',
    'auth.no_account': "Don't have an account?",
    'auth.signup_link': 'Sign up',
    'auth.create_account': 'Create account',
    'auth.join_subtitle': 'Join Depthly and start exploring',
    'auth.name': 'Full Name',
    'auth.signup_btn': 'Create Account',
    'auth.has_account': 'Already have an account?',
    'auth.signin_link': 'Sign in',
    'explore.placeholder': 'What do you want to understand?',
    'explore.stop': 'Stop Generating',
    'explore.level': 'Level',
    'explore.empty_title': 'Select a topic',
    'explore.empty_desc': 'Select a topic and depth level to begin learning.',
    'explore.error': 'Sorry, something went wrong while generating the explanation. Please try again.',
    'history.title': 'Your History',
    'history.clear': 'Clear History',
    'history.empty_title': 'No history yet',
    'history.empty_desc': 'Explanations you generate will appear here.',
    'lvl.Kids': 'Kids',
    'lvl.Teens': 'Teens',
    'lvl.Novice': 'Novice',
    'lvl.College': 'College',
    'lvl.Expert': 'Expert'
  },
  es: {
    'nav.explore': 'Explorar',
    'nav.history': 'Historial',
    'nav.logout': 'Cerrar sesión',
    'auth.welcome': 'Bienvenido de nuevo',
    'auth.signin_subtitle': 'Inicia sesión para continuar aprendiendo',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.signin_btn': 'Iniciar sesión',
    'auth.no_account': '¿No tienes una cuenta?',
    'auth.signup_link': 'Regístrate',
    'auth.create_account': 'Crear cuenta',
    'auth.join_subtitle': 'Únete a Depthly y comienza a explorar',
    'auth.name': 'Nombre completo',
    'auth.signup_btn': 'Crear cuenta',
    'auth.has_account': '¿Ya tienes una cuenta?',
    'auth.signin_link': 'Inicia sesión',
    'explore.placeholder': '¿Qué quieres entender?',
    'explore.stop': 'Detener generación',
    'explore.level': 'Nivel',
    'explore.empty_title': 'Selecciona un tema',
    'explore.empty_desc': 'Selecciona un tema y un nivel de profundidad para comenzar.',
    'explore.error': 'Lo siento, algo salió mal al generar la explicación. Por favor intenta de nuevo.',
    'history.title': 'Tu historial',
    'history.clear': 'Borrar historial',
    'history.empty_title': 'Aún no hay historial',
    'history.empty_desc': 'Las explicaciones que generes aparecerán aquí.',
    'lvl.Kids': 'Niños',
    'lvl.Teens': 'Adolescentes',
    'lvl.Novice': 'Novato',
    'lvl.College': 'Universitario',
    'lvl.Expert': 'Experto'
  },
  fr: {
    'nav.explore': 'Explorer',
    'nav.history': 'Historique',
    'nav.logout': 'Déconnexion',
    'auth.welcome': 'Bon retour',
    'auth.signin_subtitle': 'Connectez-vous pour continuer à apprendre',
    'auth.email': 'Adresse e-mail',
    'auth.password': 'Mot de passe',
    'auth.signin_btn': 'Se connecter',
    'auth.no_account': 'Pas de compte ?',
    'auth.signup_link': "S'inscrire",
    'auth.create_account': 'Créer un compte',
    'auth.join_subtitle': 'Rejoignez Depthly et commencez à explorer',
    'auth.name': 'Nom complet',
    'auth.signup_btn': 'Créer un compte',
    'auth.has_account': 'Vous avez déjà un compte ?',
    'auth.signin_link': 'Se connecter',
    'explore.placeholder': 'Que voulez-vous comprendre ?',
    'explore.stop': 'Arrêter la génération',
    'explore.level': 'Niveau',
    'explore.empty_title': 'Choisissez un sujet',
    'explore.empty_desc': 'Sélectionnez un sujet et un niveau de profondeur pour commencer.',
    'explore.error': 'Désolé, une erreur s\'est produite lors de la génération. Veuillez réessayer.',
    'history.title': 'Votre historique',
    'history.clear': 'Effacer l\'historique',
    'history.empty_title': 'Pas encore d\'historique',
    'history.empty_desc': 'Les explications que vous générez apparaîtront ici.',
    'lvl.Kids': 'Enfants',
    'lvl.Teens': 'Ados',
    'lvl.Novice': 'Novice',
    'lvl.College': 'Étudiant',
    'lvl.Expert': 'Expert'
  },
  de: {
    'nav.explore': 'Entdecken',
    'nav.history': 'Verlauf',
    'nav.logout': 'Abmelden',
    'auth.welcome': 'Willkommen zurück',
    'auth.signin_subtitle': 'Melden Sie sich an, um weiterzulernen',
    'auth.email': 'E-Mail-Adresse',
    'auth.password': 'Passwort',
    'auth.signin_btn': 'Anmelden',
    'auth.no_account': 'Kein Konto?',
    'auth.signup_link': 'Registrieren',
    'auth.create_account': 'Konto erstellen',
    'auth.join_subtitle': 'Treten Sie Depthly bei und fangen Sie an zu entdecken',
    'auth.name': 'Vollständiger Name',
    'auth.signup_btn': 'Konto erstellen',
    'auth.has_account': 'Bereits ein Konto?',
    'auth.signin_link': 'Anmelden',
    'explore.placeholder': 'Was möchtest du verstehen?',
    'explore.stop': 'Generierung stoppen',
    'explore.level': 'Niveau',
    'explore.empty_title': 'Thema auswählen',
    'explore.empty_desc': 'Wähle ein Thema und eine Tiefe, um zu beginnen.',
    'explore.error': 'Entschuldigung, bei der Erstellung der Erklärung ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    'history.title': 'Dein Verlauf',
    'history.clear': 'Verlauf löschen',
    'history.empty_title': 'Noch kein Verlauf',
    'history.empty_desc': 'Hier erscheinen deine generierten Erklärungen.',
    'lvl.Kids': 'Kinder',
    'lvl.Teens': 'Teenager',
    'lvl.Novice': 'Anfänger',
    'lvl.College': 'Student',
    'lvl.Expert': 'Experte'
  },
  ja: {
    'nav.explore': '探索',
    'nav.history': '履歴',
    'nav.logout': 'ログアウト',
    'auth.welcome': 'お帰りなさい',
    'auth.signin_subtitle': '学習を続けるにはサインインしてください',
    'auth.email': 'メールアドレス',
    'auth.password': 'パスワード',
    'auth.signin_btn': 'サインイン',
    'auth.no_account': 'アカウントをお持ちでないですか？',
    'auth.signup_link': '登録',
    'auth.create_account': 'アカウント作成',
    'auth.join_subtitle': 'Depthlyに参加して探索を始めましょう',
    'auth.name': '氏名',
    'auth.signup_btn': 'アカウント作成',
    'auth.has_account': 'すでにアカウントをお持ちですか？',
    'auth.signin_link': 'サインイン',
    'explore.placeholder': '何を理解したいですか？',
    'explore.stop': '生成を停止',
    'explore.level': 'レベル',
    'explore.empty_title': 'トピックを選択',
    'explore.empty_desc': 'トピックと深度レベルを選択して学習を開始してください。',
    'explore.error': '申し訳ありません。説明の生成中に問題が発生しました。もう一度お試しください。',
    'history.title': '履歴',
    'history.clear': '履歴を消去',
    'history.empty_title': '履歴はまだありません',
    'history.empty_desc': '生成した説明がここに表示されます。',
    'lvl.Kids': '子供向け',
    'lvl.Teens': '中高生',
    'lvl.Novice': '初心者',
    'lvl.College': '大学生',
    'lvl.Expert': '専門家'
  },
  zh: {
    'nav.explore': '探索',
    'nav.history': '历史记录',
    'nav.logout': '登出',
    'auth.welcome': '欢迎回来',
    'auth.signin_subtitle': '登录以继续学习',
    'auth.email': '电子邮件',
    'auth.password': '密码',
    'auth.signin_btn': '登录',
    'auth.no_account': '没有账号？',
    'auth.signup_link': '注册',
    'auth.create_account': '创建账号',
    'auth.join_subtitle': '加入 Depthly 开始探索',
    'auth.name': '全名',
    'auth.signup_btn': '创建账号',
    'auth.has_account': '已有账号？',
    'auth.signin_link': '登录',
    'explore.placeholder': '你想了解什么？',
    'explore.stop': '停止生成',
    'explore.level': '等级',
    'explore.empty_title': '选择一个主题',
    'explore.empty_desc': '选择一个主题和深度等级开始学习。',
    'explore.error': '抱歉，生成解释时出现问题。请重试。',
    'history.title': '你的历史记录',
    'history.clear': '清除历史',
    'history.empty_title': '暂无历史记录',
    'history.empty_desc': '你生成的解释将显示在这里。',
    'lvl.Kids': '儿童',
    'lvl.Teens': '青少年',
    'lvl.Novice': '新手',
    'lvl.College': '大学生',
    'lvl.Expert': '专家'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly supportedLanguages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ];

  private currentLangSignal = signal<Language>('en');
  
  currentLang = computed(() => this.currentLangSignal());

  constructor() {
    const saved = localStorage.getItem('depthly_lang') as Language;
    if (saved && TRANSLATIONS[saved]) {
      this.currentLangSignal.set(saved);
    }
  }

  setLanguage(lang: Language) {
    if (TRANSLATIONS[lang]) {
      this.currentLangSignal.set(lang);
      localStorage.setItem('depthly_lang', lang);
    }
  }

  translate(key: string): string {
    const lang = this.currentLangSignal();
    const map = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    return map[key] || key;
  }
}