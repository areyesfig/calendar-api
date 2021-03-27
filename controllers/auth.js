//para no perder el autocompletado tipado
const { response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');



const crearUsuario = async(req, res = response) => {

    const { email,password } = req.body;
    
    try {

        let usuario = await Usuario.findOne({email});

        if(usuario){
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario ya existe con ese mail'
            });
        }


        usuario = new Usuario(req.body);
        
        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        await usuario.save();
        
        
        //Generar JWT
        const token = await generarJWT( usuario.id, usuario.name);
        
        
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token 
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con su administrador de sistema'
        })
    }
}

const loginUsuario = async(req, res =response) => {
    
    const {email,password } = req.body;
   
    try {

        let usuario = await Usuario.findOne({email});

        if(!usuario){
            return res.status(400).json({
                ok:false,
                msg: 'Mail no asociado a ningun usuario'
            });
        }

        //confirmar las contraseñas 
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Password incorrecto'
            });
        }

        //Generacion de JWT
        const token = await generarJWT( usuario.id, usuario.name);

        res.json({
            ok:true,
            uid:usuario.id,
            name:usuario.name,
            token
        });


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con su administrador de sistema'
        })
    }

}

const revalidarToken = async(req, res = response) => {
    
    const uid = req.uid;
    const name = req.name;

    const token = await generarJWT( uid, name);
    
    res.json({
        ok: true,
        token
    })
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}