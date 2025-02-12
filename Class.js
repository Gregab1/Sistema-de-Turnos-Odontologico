
const { v4: uuidv4 } = require('uuid');

class Paciente {
    constructor(id, nombre, apellido, dni, domicilio,distrito,correo, telefono, fNac, tipoTurnos,fecha,hora,estado,diagnostico,medicacion) {
        this.id = id || uuidv4();
        this.nombre = nombre;          // Nombre
        this.apellido = apellido;      // Apellido
        this.dni = dni;                // DNI
        this.domicilio = domicilio;    // Domicilio
        this.distrito = distrito;      // Distrito
        this.correo = correo;          // Correo Electrónico
         this.telefono = telefono;      // Teléfono
        
        this.fNac = fNac;              // Fecha de Nacimiento
       
       
        this.tipoTurnos = tipoTurnos;  // Tipo de Turno
        this.fecha=fecha;
        this.hora=hora;
        this.estado=estado;
        this.diagnostico=diagnostico;
        this.medicacion=medicacion;
        
        
    }

    getId() { return this.id; }

    setNombre(nombre) { this.nombre = nombre; }
    getNombre() { return this.nombre; }

    setApellido(apellido) { this.apellido = apellido; }
    getApellido() { return this.apellido; }

    setCorreo(correo) { this.correo = correo; }
    getCorreo() { return this.correo; }

    setFNac(fNac) { this.fNac = fNac; }
    getFNac() { return this.fNac; }

    setDomicilio(domicilio) { this.domicilio = domicilio; }
    getDomicilio() { return this.domicilio; }

    setDistrito(distrito) { this.distrito = distrito; }
    getDistrito() { return this.distrito; }

    setTelefono(telefono) { this.telefono = telefono; }
    getTelefono() { return this.telefono; }

    setDNI(dni) { this.dni = dni; }
    getDNI() { return this.dni; }

    setTipoTurnos(tipoTurnos) { this.tipoTurnos = tipoTurnos; }
    getTipoTurnos() { return this.tipoTurnos; }
    setFecha(fecha){this.fecha=fecha;}
    getFecha(){return this.fecha;}
    setHora(hora){
        this.hora=hora;
    }
    getHora(){return this.hora;}
    setEstado(estado){
        this.estado=estado;
    }
    getEstado(){return this.estado;}
    setDiagnositco(diagnostico){
        this.diagnostico=diagnostico;
    }
    getDiagnostico(){return this.diagnostico;}
    setMedicacion(medicacion){
        this.medicacion=medicacion;
    }
    getMedicacion(){
        return this.medicacion;
    }
    

    
}

module.exports =  Paciente ;
