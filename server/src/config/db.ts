import mongoose from 'mongoose'
import colors from 'colors'

export const connectDB = async () => {

    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error("MONGO_URI no está definida en el .env");
        }

        const connection = await mongoose.connect(mongoUri);
        const url = `${connection.connection.host}: ${connection.connection.port}`
        console.log(colors.cyan.bold(`Conectado correctamente a la base de datos devtree en: ${url}`));
    } catch (error) {
        if (error instanceof Error) {
            console.log(colors.red.bold(error.message));
        } else {
            console.log(colors.red.bold("Error desconocido al conectar DB"));
        }
        throw new Error("No se ha podido conectar a la base de datos");
    }

}