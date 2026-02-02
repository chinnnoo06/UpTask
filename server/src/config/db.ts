import mongoose from 'mongoose'
import colors from 'colors'

export const connectDB = async () => {

    try{
        const connection = await mongoose.connect("mongodb://localhost:27017/up_task");
        const url = `${connection.connection.host}: ${connection.connection.port}`
        console.log(colors.cyan.bold(`Conectado correctamente a la base de datos up_task en: ${url}`));
    } catch (error) {
        console.log(colors.red.red(error));
        throw new Error("No se ha podido conectar a la base de datos");
    }

}