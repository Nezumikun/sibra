declare module '#auth-utils' {
  interface User {
    id: number
    name: string
    fullName: string
  }

  interface UserSession {
    currentGame: Game?
  }

  // interface SecureSessionData {
  //   // Add your own fields
  // }
}

export {}
