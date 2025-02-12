const controlador = {};
const Pacientedata = require('../modelo/modeloPaci');
const Paciente = require('../Class.js');
const { request, response, json } = require('express');


// Menú principal
controlador.home = (request, response) => {
    response.render('index');
};

controlador.Turno = (request, response) => {
    response.render('Turno');
};
controlador.Noty=(request, response)=>{
    response.render('notificacion');
};

controlador.login = (request, response) => {
    response.render('login');  
};
controlador.datosPaci= (request, response) => {
    response.render('datosPaci');  
};
// Método PUT para actualizar un paciente
controlador.put = async (req, res) => {
    try {
        const { id } = req.params; // Obtiene el ID desde los parámetros de la URL
        const datosActualizados = req.body; // Obtiene los datos desde el cuerpo de la solicitud
        console.log("ID recibido desde la URL:", id); // Verifica el DNI proporcionado
        console.log("Nuevos valores recibidos:", datosActualizados); // Imprimir los datos recibidos

        // Llama al modelo para actualizar el paciente en la base de datos
        const pacienteActualizado = await Pacientedata.actualizarPaciente(id, datosActualizados);
        
        res.status(200).json({
            mensaje: "Paciente actualizado correctamente",
            paciente: pacienteActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el paciente:", error);
        res.status(500).json({
            mensaje: "Error al actualizar el paciente",
            error: error.message
        });
    }
};
controlador.putpac = async (req, res) => {
    try {
        const { id } = req.params; 
        const datosActualizados = req.body; 
        console.log("ID recibido desde la URL:", id); 
        console.log("Nuevos valores recibidos desde atendido:", datosActualizados); 

        // Llama al modelo para actualizar el paciente en la base de datos
        const pacienteActualizado = await Pacientedata.actualizarPacienteAtendido(id, datosActualizados);
        
        res.status(200).json({
            mensaje: "Paciente actualizado correctamente",
            paciente: pacienteActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el paciente:", error);
        res.status(500).json({
            mensaje: "Error al actualizar el paciente",
            error: error.message
        });
    }
};


controlador.admi= async (request,response)=>{
    const listaHistortial= await Pacientedata.traerTurnosA();
    response.render('administrador/odontologia',{pacientesHH:listaHistortial});
}
controlador.soli= async (request,response)=>{
    const resultadoPacientes = await Pacientedata.traerTurnosToodos(); // Pasar los objetos
    const resutadosPaceintesAsigado= await Pacientedata.traerTurnosToodosAsignados();// aca mando todos los turnos asignados
    response.render('administrador/solicitud',{pacientes:resultadoPacientes,pacientesAsig:resutadosPaceintesAsigado});

}

controlador.aten= (request,response)=>{
    

    response.render('administrador/atendido');
}
controlador.agen=async (request,response)=>{
    const resutadosPaceintesAsigado= await Pacientedata.traerTurnosToodosAsignados();// aca mando todos los turnos asignados
    response.render('administrador/agendado',{pacientesA:resutadosPaceintesAsigado});
}

// Registro de pacientes
controlador.registerPost = async (request, response) => {
   
    try {
         var fecha="sin fecha";
         var hora ="sin hora";
         var estado="en espera";
         var diagnostico="";
         var medicacion="";
        const {id, nombre, apellido, dni, domicilio, distrito, correo, telefono, fNac, tipoTurnos} = request.body;
        console.log("manda esto "+request.body)

        // Crear un nuevo paciente en memoria
        const nuevoPaciente = new Paciente(id,nombre, apellido, dni, domicilio, distrito, correo, telefono, fNac, tipoTurnos,fecha,hora,estado, diagnostico,medicacion);
        console.log( "este es el psciente"+ JSON.stringify(nuevoPaciente))

        // Guardar el paciente en la base de datos
        const result = await Pacientedata.guardarPaciente(nuevoPaciente); 

        console.log('Paciente registrado en la base de datos:', result[0]);
        response.render('notificacion', { mensaje: result });

       
       
    } catch (error) {
        console.error('Error al registrar el paciente:', error);
        response.status(500).send('Error al registrar el paciente.');
    }
};
controlador.loginPost= async (req, res) => {
    try {
        
        const dni = req.body.username; // Obtener DNI 
        const listaPaciente = await Pacientedata.traerTurnos(dni); 
        res.render('datosPaci',{pacientes:listaPaciente});
       
    } catch (error) {
        console.error("Error al traer paciente:", error);
        res.status(500).send("Error al traer paciente");
    }
   
};
controlador.buscadorPost= async (request,response)=>{
    const dni=request.body.dni;
    const fecha=request.body.fecha;
    const estado=request.body.estado;
    console.log("datos para b uscar atendidios ",dni,fecha,estado);
    
    const listaPacientesAtendido= await Pacientedata.traerTurnosToodosAtendidos(dni,fecha,estado); //traigos los turnos atendidos

    response.render('administrador/atendido',{pacientesAten:listaPacientesAtendido});
}

module.exports = controlador;
