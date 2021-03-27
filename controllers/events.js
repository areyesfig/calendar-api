const { response } = require('express');
const { findByIdAndUpdate } = require('../models/Evento');
const Evento = require('../models/Evento');
const Usuario = require('../models/Usuario');



const getEventos = async(req, res = response) => {

    const evento = await Evento.find()
                                .populate('user','name');

    res.json({
        ok:true,
        evento
    });

}


const crearEventos = async(req, res = response) => {

   const evento = new Evento(req.body);

   try {
    
    evento.user = req.uid;
       
    const eventoGuardado = await evento.save();

    res.json({
        ok:true,
        evento:eventoGuardado
    });

   } catch (error) {
       console.log(error);
       res.status(500).json({
           ok:false,
           msg:'Hable con administrador de sistema'
       });
   }

   

}


const actualizarEventos = async(req, res = response) => {

    const eventoId = req.params.id;

    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;


        if(!evento){
           return res.status(404).json({
                ok:false,
                msg:"Evento no existe"
            });
        }


        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:"No tiene privilegios para editar"
            });
        }

        const nuevoEvento = {
            ...req.body,
            user:uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, {new: true });

        res.json({
            ok:true,
            evento: eventoActualizado
        });
        


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con administrador de sistema"
        })
        
    }

}


const eliminarEventos = async(req, res = response) => {


    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById(eventoId);
       
        if(!evento){
            return res.status(404).json({
                ok:false,
                msg:"Evento no existe"
            });
        }


        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok:false,
                msg:"No tiene privilegios para eliminar este evento"
            });
        }

      

        await Evento.findByIdAndDelete( eventoId);

        res.json({
            ok:true
        });
        


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:"Hable con administrador de sistema"
        })
        
    }
}

module.exports = {
    getEventos,
    crearEventos,
    actualizarEventos,
    eliminarEventos
}

