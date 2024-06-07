const{CodigoReferido}= require ('../models/codigosReferidos');


const actualizarCodigoReferido = async (idReferido, nuevoCodigo) => {
    try {
        const cod = await CodigoReferido.findByPk(idReferido);
       
        if (!cod) {
            throw new Error('El código referido especificado no existe');
        }

        // Actualiza el campo `codigo` con el nuevo código
        cod.codigo = nuevoCodigo;
        

        // Guarda los cambios en la base de datos   
        await cod.save();

        return { status: true, message: 'Datos guardados exitosamente.' };
    } catch (error) {
        return { status: false, message: 'Error modificando registro: '  + error.message };
    }
};








module.exports={actualizarCodigoReferido}