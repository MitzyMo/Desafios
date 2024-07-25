import { UserManager } from "../dao/UserManagerDB.js";

export class UserService {
    constructor(userData) {
        this.userData = userData
    }
    getUserById = async (id) => {
      return this.userData.getBy(id)
  }
    verifyEmail = async (email) => {
        return this.userData.getBy(email)
    }

    updatePassword = async (id, hashedPassword) => {
        console.log("New Pwd:" + hashedPassword)
        return this.userData.update(id, hashedPassword)
    }

    updateRole = async (id, nuevoRole) => {
        return this.userData.updateRole(id, nuevoRole)
    }


}

//Podria ir al controlador y generar mi instancia de esta clase ahi pero para no tener que tocar nunca nada ahi si despues tengo que hacer algun cambio, lo que hago es instanciar mi ProductService aca y exportar esa instancia a la que ya le paso el dao como argumento