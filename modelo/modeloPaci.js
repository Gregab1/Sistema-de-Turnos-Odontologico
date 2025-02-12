const db = require('../conexion/db'); // Importar la conexión de libreria
const Paciente = require('../Class.js'); 
const nodemailer = require('nodemailer'); // Importa nodemailer libreria para notificacion
class Modelo {
    // Guardar un nuevo paciente
    static async guardarPaciente(paciente) {
        try {
            const sql = `
            INSERT INTO public.Pacientes (id, nombre, apellido, dni, domicilio, distrito, correo, telefono, fNac, tipoTurnos, fecha, hora, estado, diagnostico, medicacion)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`;
            
            const params = [
                paciente.id, paciente.nombre, paciente.apellido, paciente.dni,
                paciente.domicilio, paciente.distrito, paciente.correo, paciente.telefono,
                paciente.fNac, paciente.tipoTurnos, paciente.fecha, paciente.hora,
                paciente.estado, paciente.diagnostico, paciente.medicacion
            ];
    
            await db.query(sql, params);
            return "Su turno fue registrado con éxito. Se le enviará un correo con información de turno. Revisar en spam si no lo encuentra.Tambien puede consultar su turno desde seccion <<Consular turno>>";

            
        } catch (error) {
            return "Error: No pudimos cargar su turno. Por favor, inténtelo de nuevo.";
        }
    }

  
   
    static async traerTurnosToodos() {
        try {
            var estado="en espera";
           // console.log("Valor del DNI en traerTurnos en : "+ estado);
          //  console.log("Clase Paciente importada:"+ Paciente);

            const sql = `SELECT * FROM public.Pacientes WHERE estado = $1`;
            const result = await db.query(sql, [estado]);
            
          
    
            // Verifica si el resultado ya es un array
            if (!result || result.length === 0) {
                console.log("No se encontraron pacientes  'en espera' proporcionado.");
                return []; // Retorna un array vacío si no hay resultados
            }
    
            // Convertir cada fila del resultado en un objeto Paciente
            const listaPacientes = result.map((row) => {
                return new Paciente(
                    row.id,
                    row.nombre,        
                    row.apellido,      
                    row.dni,           
                    row.domicilio,     
                    row.distrito,      
                    row.correo,        
                    row.telefono,      
                    row.fnac,          
                    row.tipoturnos,     
                    row.fecha,
                    row.hora,
                    row.estado
                );
            });
            
       //    console.log("Lista de pacientes generada:", listaPacientes);
           

           
            return listaPacientes; // Devuelve el array de objetos Paciente
        } catch (error) {
            console.error("Error en traerTurnos:", error);
            throw error;
        }
    }

   
   
    
    // Actualizar un paciente existente
    static async actualizarPaciente(id, datosActualizados) {
        const sql = `
        UPDATE public.Pacientes
        SET 
            nombre = $1,
            apellido = $2,
            dni = $3,
            domicilio = $4,
            distrito = $5,
            correo = $6,
            telefono = $7,
            fNac = $8,
            tipoTurnos = $9,
            fecha = $10,
            hora = $11,
            estado = $12,
            diagnostico = $13,
            medicacion = $14
        WHERE id = $15;`;

        const params = [
            datosActualizados.nombre,
            datosActualizados.apellido,
            datosActualizados.dni,
            datosActualizados.domicilio,
            datosActualizados.distrito,
            datosActualizados.correo,
            datosActualizados.telefono,
            datosActualizados.fNac,
            datosActualizados.tipoTurnos,
            datosActualizados.fecha,
            datosActualizados.hora,
            datosActualizados.estado,
            datosActualizados.diagnostico,
            datosActualizados.medicacion,
            id
        ];

        try {
            const result = await db.query(sql, params);

            if (!result || result.rowCount === 0) {
                console.error(`No se encontró el paciente con ID: ${id}`);
                return null;
            }

            // Enviar correo después de actualizar
            await this.enviarCorreoNotificacion(datosActualizados.correo, datosActualizados);

            return { mensaje: 'Paciente actualizado con éxito y notificación enviada.' };
        } catch (error) {
            console.error(`Error al actualizar el paciente con ID ${id}:`, error.message || error);
            throw error;
        }
    }

    // Método para enviar el correo
    static async enviarCorreoNotificacion(destinatario, datos) {
        const fechaISO = datos.fecha;
const fechaFormateada = new Date(fechaISO).toLocaleDateString('es-ES'); 
        
        if (!destinatario) {
            console.warn('No se enviará correo porque no hay un destinatario.');
            return;
        }

        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'josuellanos796@gmail.com', 
                pass: 'ucrxxccphhcdvxuf' 
            }
        });

        
        const mailOptions = {
            from: '"Consultorio Odontologico"<josuellanos796@gmail.com>',
            to: destinatario,
            subject: 'Turno Asignado:',
            text: `Hola ${datos.nombre}, se te asignado un turno Odontologico para:

            Información:
            - Paciente: ${datos.nombre} ${datos.apellido}
            - DNI: ${datos.dni}
            - Fecha de Turno: ${fechaFormateada} a las ${datos.hora}

            Esperamos verte pronto. ¡Gracias por atenderte en DentiCracks! 😊.`
        };

        // Enviar el correo
        try {
            await transporter.sendMail(mailOptions);
            console.log(`Correo de notificación enviado a: ${destinatario}`);
        } catch (error) {
            console.error('Error al enviar el correo:', error.message || error);
        }
    }

    static async traerTurnosToodosAsignados() {
        try {
            var estado="asignado";
       

            const sql = `SELECT * FROM public.Pacientes WHERE estado = $1`;
            const result = await db.query(sql, [estado]);
            
           
    
            // Verifica si el resultado ya es un array
            if (!result || result.length === 0) {
                console.log("No se encontraron pacientes para el estado Asignado proporcionado.");
                return []; // Retorna un array vacío si no hay resultados
            }
    
            // Convertir cada fila del resultado en un objeto Paciente
            const listaPacientes = result.map((row) => {
               
                return new Paciente(
                    row.id,
                    row.nombre,        
                    row.apellido,      
                    row.dni,           
                    row.domicilio,     
                    row.distrito,      
                    row.correo,       
                    row.telefono,      
                    row.fnac,          
                    row.tipoturnos,     
                    row.fecha,
                    row.hora,
                    row.estado,
                    row.diagnostico,
                    row.medicacion
                );
            });
            
            //console.log("Lista de pacientes generada asignados :", listaPacientes);
           
            listaPacientes.sort((a, b) => {
                const fechaHoraA = new Date(`${a.fecha}T${a.hora}`);
                const fechaHoraB = new Date(`${b.fecha}T${b.hora}`);
               
                return fechaHoraA - fechaHoraB; // Orden ascendente (menor a mayor)
            });
            
           
           
            return listaPacientes; // Devuelve el array de objetos Paciente
        } catch (error) {
            console.error("Error en traerTurnos:", error);
            throw error;
        }
    }
    static async actualizarPacienteAtendido(id, datosActualizados) {
        const sql = `
        UPDATE public.Pacientes
        SET 
            nombre = $1,
            apellido = $2,
            dni = $3,
            domicilio = $4,
            distrito = $5,
            correo = $6,
            telefono = $7,
            fNac = $8,
            tipoTurnos = $9,
            fecha = $10,
            hora = $11,
            estado = $12,
            diagnostico = $13,
            medicacion = $14
        WHERE id = $15;`; 
    
        const params = [
            datosActualizados.nombre,
            datosActualizados.apellido,
            datosActualizados.dni,
            datosActualizados.domicilio,
            datosActualizados.distrito,
            datosActualizados.correo,
            datosActualizados.telefono,
            datosActualizados.fNac,
            datosActualizados.tipoTurnos,
            datosActualizados.fecha,
            datosActualizados.hora,
            datosActualizados.estado,
            datosActualizados.diagnostico,
            datosActualizados.medicacion,
            id
        ];
    
        try {
            const result = await db.query(sql, params);
    
            if (!result || result.rowCount === 0) {
                console.error(`No se encontró el paciente con ID: ${id}`);
                return null; 
            }
    
            return { mensaje: 'Paciente actualizado con éxito.' };
        } catch (error) {
            console.error(`Error al actualizar el paciente con ID ${id}:`, error.message || error);
            throw error; 
        }
    }
    static async traerTurnos(dni) {
        try {
            
      

            const sql = `SELECT * FROM public.Pacientes WHERE dni = $1`;
            const result = await db.query(sql, [dni]);
            
          
    
            // Verifica si el resultado ya es un array
            if (!result || result.length === 0) {
                console.log("No se encontraron pacientes para el estado Asignado proporcionado.");
                return []; // Retorna un array vacío si no hay resultados
            }
    
            // Convertir cada fila del resultado en un objeto Paciente
            const listaPacientes = result.map((row) => {
                return new Paciente(
                    row.id,
                    row.nombre,        
                    row.apellido,      
                    row.dni,           
                    row.domicilio,     
                    row.distrito,      
                    row.correo,        
                    row.telefono,      
                    row.fnac,         
                    row.tipoturnos,     
                    row.fecha,
                    row.hora,
                    row.estado,
                    row.diagnostico,
                    row.medicacion
                );
            });
            
            const listaPacienteVer=[];
             for(const paciente of listaPacientes){
             if(paciente.estado==="en espera"|| paciente.estado==="asignado"){
                listaPacienteVer.push(paciente);
              
             }
             }
           

             return listaPacienteVer;
          //  return listaPacientes; // Devuelve el array de objetos Paciente
        } catch (error) {
            console.error("Error en traerTurnos:", error);
            throw error;
        }
    }
    static async traerTurnosToodosAtendidos(dni,fechaB, estado) {
        try {
      

            const sql = `SELECT * FROM public.Pacientes WHERE dni = $1 AND fecha= $2 AND estado= $3`;
            const result = await db.query(sql, [dni,fechaB,estado]);
      
            // Verifica si el resultado ya es un array
            if (!result || result.length === 0) {
                console.log("No se encontraron pacientes para el estado Asignado proporcionado.");
                return []; // Retorna un array vacío si no hay resultados
            }
    
            // Convertir cada fila del resultado en un objeto Paciente
            const listaPacientes = result.map((row) => {
                return new Paciente(
                    row.id,
                    row.nombre,        
                    row.apellido,      
                    row.dni,           
                    row.domicilio,     
                    row.distrito,      
                    row.correo,        
                    row.telefono,     
                    row.fnac,          
                    row.tipoturnos,     
                    row.fecha,
                    row.hora,
                    row.estado,
                    row.diagnostico,
                    row.medicacion
                );
            });
            
            console.log("Lista de pacientes generada Atendidos :", listaPacientes);
         
           
            return listaPacientes; // Devuelve el array de objetos Paciente
        } catch (error) {
            console.error("Error en traerTurnos:", error);
            throw error;
        }
    }
    static async traerTurnosA() {
        try {
            var estado="Atendido";
    

            const sql = `SELECT * FROM public.Pacientes WHERE estado = $1`;
            const result = await db.query(sql, [estado]);
            
           
            if (!result || result.length === 0) {
                console.log("No se encontraron pacientes para el estado Asignado proporcionado.");
                return []; // Retorna un array vacío si no hay resultados
            }
    
            // Convertir cada fila del resultado en un objeto Paciente
            const listaPacientes = result.map((row) => {
                return new Paciente(
                    row.id,
                    row.nombre,        
                    row.apellido,      
                    row.dni,          
                    row.domicilio,     
                    row.distrito,      
                    row.correo,        
                    row.telefono,      
                    row.fnac,          
                    row.tipoturnos,     
                    row.fecha,
                    row.hora,
                    row.estado,
                    row.diagnostico,
                    row.medicacion
                );
            });
            
            console.log("Lista de pacientes generada Atendidos :", listaPacientes);
           

           
            return listaPacientes; // Devuelve el array de objetos Paciente
        } catch (error) {
            console.error("Error en traerTurnos:", error);
            throw error;
        }
    }
    
          
    
 
    
    
}

module.exports = Modelo;
