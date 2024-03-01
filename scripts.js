// Arreglos
let procesos = [];
let ordenarProcesos = [];
let index = 1;
let posicionActual = 0;
let tiempoProcesos = [];

const seleccionAlgoritmo = document.getElementById("seleccionAlgoritmo");
const prioridad = document.getElementById("prioridad");
const quantum = document.getElementById("quantum");
seleccionAlgoritmo.addEventListener("change", function(){
    const opcionActual = seleccionAlgoritmo.value;
    if(opcionActual === "Prioridades"){
        prioridad.removeAttribute("disabled");
    } else{
        prioridad.setAttribute("disabled", "disabled");
    }
    if(opcionActual === "Round Robin"){
        quantum.removeAttribute("disabled");
    }
    else{
        quantum.setAttribute("disabled", "disabled");
    }
})

// Funcion para agregar un proceso a la lista y a la tabla
function agregarProceso() {
    const tiempoLlegada = Math.abs(parseInt(document.getElementById("tiempoLlegada").value));
    const tiempoRafaga = Math.abs(parseInt(document.getElementById("tiempoRafaga").value));
    if (isNaN(tiempoLlegada)|| isNaN(tiempoRafaga)) {
        alert("Por favor, complete todos los campos obligatorios.");
        return; // Evitar que el formulario se envíe 
      }
    let prioridad = parseInt(document.getElementById("prioridad").value);
      if (isNaN(prioridad)){
            prioridad = "---";
        }
    let quantum = parseInt(document.getElementById("quantum").value);
    if(!isNaN(quantum)){
        const text_planificacion = document.getElementById("text_planificacion");
        text_planificacion.innerHTML = `Planificacion: Quantum de ${quantum}`;
    }
    const numeroProceso = `P${index}`;  
    const proceso = { numeroProceso, tiempoLlegada, tiempoRafaga, prioridad };
    index++; 
    procesos.push(proceso);
    procesos.sort((a, b) => a.tiempoLlegada - b.tiempoLlegada);
    //Limpiar valores del formulario
    document.getElementById("tiempoLlegada").value = "";
    document.getElementById("tiempoRafaga").value = "";
    document.getElementById("prioridad").value = "---";
    actualizarTablaProcesos(procesos);
}

function ordenarFIFO(){
    ordenarProcesos = [];
    posicionActual = procesos[0].tiempoLlegada;
    procesos.forEach((proceso) => {
        const numeroProceso = proceso.numeroProceso;
        const tiempoLlegada = proceso.tiempoLlegada;
        const tiempoRafaga = proceso.tiempoRafaga;
        const prioridad = proceso.prioridad;
        
        //asignar posicion actual para espacios en blanco
        posicionActual = tiempoLlegada > posicionActual ? tiempoLlegada : posicionActual;

        ordenarProcesos.push({x:[posicionActual,posicionActual + tiempoRafaga], y:numeroProceso})
        ordenarProcesos.sort((a, b) => a.tiempoLlegada - b.tiempoLlegada);
        posicionActual += tiempoRafaga;
        
    });
    tiempoProcesos = procesos;
}

function ordenarSJF(){
    ordenarProcesos = [];
    posicionActual = procesos[0].tiempoLlegada;
    let listaAuxiliar = procesos;
    let tiempoTotal = 0;

    while (listaAuxiliar.length > 0) {
        const procesosDisponibles = listaAuxiliar.filter(proceso => proceso.tiempoLlegada <= tiempoTotal);
        if (procesosDisponibles.length === 0) {
          tiempoTotal++;
          continue;
        }
  
        const procesoEjecutar = procesosDisponibles.reduce((prev, curr) => {
            return prev.tiempoRafaga < curr.tiempoRafaga ? prev : curr;
        });
        
        posicionActual = procesoEjecutar.tiempoLlegada > posicionActual ? procesoEjecutar.tiempoLlegada : posicionActual;
        ordenarProcesos.push({x:[posicionActual,posicionActual + procesoEjecutar.tiempoRafaga], y:procesoEjecutar.numeroProceso});
        let numeroProceso = procesoEjecutar.numeroProceso;
        let tiempoLlegada = procesoEjecutar.tiempoLlegada;
        let tiempoRafaga = procesoEjecutar.tiempoRafaga;
        let prioridad = procesoEjecutar.prioridad;
        //Tiempo procesos es la lista de procesos ordenada de acuerdo a su algoritmo, usada para controlar tiempos.
        tiempoProcesos.push({ numeroProceso, tiempoLlegada, tiempoRafaga, prioridad });
        tiempoTotal += procesoEjecutar.tiempoRafaga;
        listaAuxiliar = listaAuxiliar.filter(proceso => proceso !== procesoEjecutar);
        posicionActual += procesoEjecutar.tiempoRafaga;
    }
    actualizarTablaProcesos(tiempoProcesos);
    
}

function ordenarPrioridades(){
    ordenarProcesos = [];
    posicionActual = procesos[0].tiempoLlegada;
    let listaAuxiliar = procesos;
    let tiempoTotal = 0;

    while (listaAuxiliar.length > 0) {
        const procesosDisponibles = listaAuxiliar.filter(proceso => proceso.tiempoLlegada <= tiempoTotal);
        if (procesosDisponibles.length === 0) {
          tiempoTotal++;
          continue;
        }
  
        const procesoEjecutar = procesosDisponibles.reduce((prev, curr) => {
            return prev.prioridad <= curr.prioridad ? prev : curr;
        });
        
        posicionActual = procesoEjecutar.tiempoLlegada > posicionActual ? procesoEjecutar.tiempoLlegada : posicionActual;
        ordenarProcesos.push({x:[posicionActual,posicionActual + procesoEjecutar.tiempoRafaga], y:procesoEjecutar.numeroProceso});
        let numeroProceso = procesoEjecutar.numeroProceso;
        let tiempoLlegada = procesoEjecutar.tiempoLlegada;
        let tiempoRafaga = procesoEjecutar.tiempoRafaga;
        let prioridad = procesoEjecutar.prioridad;
        //Tiempo procesos es la lista de procesos ordenada de acuerdo a su algoritmo, usada para controlar tiempos.
        tiempoProcesos.push({ numeroProceso, tiempoLlegada, tiempoRafaga, prioridad });
        tiempoTotal += procesoEjecutar.tiempoRafaga;
        listaAuxiliar = listaAuxiliar.filter(proceso => proceso !== procesoEjecutar);
        posicionActual += procesoEjecutar.tiempoRafaga;
    }
    actualizarTablaProcesos(tiempoProcesos);
}
 
function ordenarRoundRobin(){
    ordenarProcesos = [];
    posicionActual = procesos[0].tiempoLlegada;
    let tiemposSistemaParaRR = {};
    let listaRafagaParaRR = [];
    let listaTiempoSistemaRR = [];
    let listaTiempoLlegadaRR = [];
    let resultadoSistemaRR = [];
    let resultadoEsperaRR = [];
    procesos.forEach((proceso) => {
        const numeroProceso = proceso.numeroProceso;
        const tiempoLlegada = proceso.tiempoLlegada;
        const tiempoRafaga = proceso.tiempoRafaga;
        tiemposSistemaParaRR[numeroProceso] = 0;
        listaTiempoLlegadaRR.push(tiempoLlegada);
        listaRafagaParaRR.push(tiempoRafaga);
    });
    let listaAuxiliar = procesos;
    let tiempoTotal = procesos.reduce((total, proceso) => total + proceso.tiempoRafaga, 0);
    let quantum = parseInt(document.getElementById("quantum").value);
    while (tiempoTotal > 0){
        listaAuxiliar.forEach((proceso) => {
            const numeroProceso = proceso.numeroProceso;
            const tiempoLlegada = proceso.tiempoLlegada;
            const tiempoRafaga = proceso.tiempoRafaga;
            
            //asignar posicion actual para espacios en blanco
            posicionActual = tiempoLlegada > posicionActual ? tiempoLlegada : posicionActual;
    
            if (tiempoRafaga >= quantum){
                proceso.tiempoRafaga -= quantum;
                ordenarProcesos.push({x:[posicionActual,posicionActual + quantum], y:numeroProceso});
                tiemposSistemaParaRR[numeroProceso] = tiemposSistemaParaRR.numeroProceso > posicionActual + quantum ? tiemposSistemaParaRR.numeroProceso : posicionActual + quantum;
                posicionActual += quantum;
                tiempoTotal -= quantum;
            }else if(tiempoRafaga > 0){
                proceso.tiempoRafaga -= tiempoRafaga;
                ordenarProcesos.push({x:[posicionActual,posicionActual + tiempoRafaga], y:numeroProceso});
                tiemposSistemaParaRR[numeroProceso] = tiemposSistemaParaRR.numeroProceso > posicionActual + tiempoRafaga ? tiemposSistemaParaRR.numeroProceso : posicionActual + tiempoRafaga;
                posicionActual += tiempoRafaga;
                tiempoTotal -= tiempoRafaga;
            }
        });
    }
    listaTiempoSistemaRR = Object.values(tiemposSistemaParaRR);
    for (var i = 0; i < listaTiempoSistemaRR.length; i++) {
        resultadoSistemaRR.push(listaTiempoSistemaRR[i] - listaTiempoLlegadaRR[i]);
        resultadoEsperaRR.push(listaTiempoSistemaRR[i] - listaRafagaParaRR[i] - listaTiempoLlegadaRR[i]);
    }
    console.log(resultadoSistemaRR);
    console.log(resultadoEsperaRR);
    //actualizarTablaProcesos(procesos, resultadoEsperaRR, resultadoSistemaRR);
    calcularTiempos(procesos, resultadoEsperaRR, resultadoSistemaRR)
}

function definirMetodo(algoritmo) {
    switch (algoritmo) {
        case "FIFO":
            ordenarFIFO();
            break;
        case "SJF":
            ordenarSJF();
            break;
        case "Prioridades":
            ordenarPrioridades();
            break;
        case "Round Robin":
            ordenarRoundRobin();
            break;
        default:
            console.log("Opción no reconocida");
    }
}

// Función para actualizar la tabla de procesos
function actualizarTablaProcesos(procesos) {
    const tabla = document.getElementById("tablaProcesos");
    
    // Limpiar la tabla antes de actualizarla
    while (tabla.rows.length > 1) {
        tabla.deleteRow(1);
    }

    // Llenar la tabla con los procesos ordenados
    procesos.forEach((proceso) => {
        const row = tabla.insertRow();
        const cellProceso = row.insertCell(0);
        const celltiempoLlegada = row.insertCell(1);
        const celltiempoRafaga = row.insertCell(2);
        const cellPrioridad = row.insertCell(3);
        const cellWaitTime = row.insertCell(4);
        const cellFinishTime = row.insertCell(5);

        cellProceso.innerHTML = proceso.numeroProceso;
        celltiempoLlegada.innerHTML = proceso.tiempoLlegada;
        celltiempoRafaga.innerHTML = proceso.tiempoRafaga;
        cellPrioridad.innerHTML = proceso.prioridad;
    });
}


const miBoton = document.getElementById('miBoton');
let miGrafico = null;
miBoton.addEventListener('click', mostrarGrafico);

//Funcion para construir el grafico.
function mostrarGrafico() {
    if (miGrafico) {
        miGrafico.destroy();
    }

    //Datos del Grafico.
    const data = {
        datasets: [
            {
                label: 'Rafaga CPU',
                data: ordenarProcesos,
                backgroundColor: ['#0042FF'],
                borderColor: ['#0D0054'],
                borderWidth: 1,
                borderSkipped: false
            }
        ]
    };

    //Configuracion del Grafico.
    const configuracion = {
        type: 'bar',
        data,
        options: {
            indexAxis: 'y',
            scales: {
                x:{
                    display: true,
                    title: {
                        display: true,
                        text: 'Rafaga de CPU (s)', 
                    },
                    min:0,
                    max:posicionActual + 5,
                },
                y:{
                    display: true,
                    title: {
                        display: true,
                        text: 'Procesos', 
                    }
                },
            },
            plugins: {
                legend:{
                    display:false
                }
            }
        }
    };

    //Crear el grafico
    miGrafico = new Chart(
        document.getElementById('myChart'),
        configuracion
    );

    // Instantly assign Chart.js version
    const chartVersion = document.getElementById('chartVersion');
    chartVersion.innerText = Chart.version;
}

// Función para ejecutar la planificación (FCFS)
function planificarProcesos() {
    const algoritmo = document.getElementById("seleccionAlgoritmo").value;
    definirMetodo(algoritmo);
    calcularTiempos(tiempoProcesos);
}
    
function calcularTiempos(procesos, resultadoEsperaRR, resultadoSistemaRR){
    // Calcular los tiempos de espera y finalización
    let currentTime = 0;
    procesos.forEach((proceso, index) => {
        if (currentTime < proceso.tiempoLlegada) {
            currentTime = proceso.tiempoLlegada;
        }
        proceso.waitTime = currentTime - proceso.tiempoLlegada;
        proceso.finishTime = currentTime + proceso.tiempoRafaga - proceso.tiempoLlegada;
        currentTime = proceso.finishTime + proceso.tiempoLlegada;
    });

    // Mostrar el resultado en la tabla
    const algoritmo = document.getElementById("seleccionAlgoritmo").value;
    const tabla = document.getElementById("tablaProcesos");
    

    // Calcular el tiempo promedio de espera
    if (algoritmo == "Round Robin"){
        resultadoEsperaRR.forEach((proceso, index) => {
            const row = tabla.rows[index + 1];
            row.cells[4].innerHTML = proceso;
        });
        resultadoSistemaRR.forEach((proceso, index) => {
            const row = tabla.rows[index + 1];
            row.cells[5].innerHTML = proceso;
        });
        const totalWaitTime = resultadoEsperaRR.reduce((total, proceso) => total + proceso, 0);
        console.log(totalWaitTime);
        const averageWaitTime = totalWaitTime/ resultadoEsperaRR.length;
        const totalSystemTime = resultadoSistemaRR.reduce((total, proceso) => total + proceso, 0);
        const averageSystemTime = totalSystemTime / resultadoSistemaRR.length;
        // Mostrar el resultado final
        const resultado_espera = document.getElementById("resultado_espera");
        resultado_espera.innerHTML = `${averageWaitTime.toFixed(2)} segundos.`;

        const resultado_sistema = document.getElementById("resultado_sistema");
        resultado_sistema.innerHTML = `${averageSystemTime.toFixed(2)} segundos.`;
    }else{
        procesos.forEach((proceso, index) => {
            const row = tabla.rows[index + 1];
            row.cells[4].innerHTML = proceso.waitTime;
            row.cells[5].innerHTML = proceso.finishTime;
        });
        const totalWaitTime = procesos.reduce((total, proceso) => total + proceso.waitTime, 0);
        const averageWaitTime = totalWaitTime / procesos.length;
        const totalSystemTime = procesos.reduce((total, proceso) => total + proceso.finishTime, 0);
        const averageSystemTime = totalSystemTime / procesos.length;

        // Mostrar el resultado final
        const resultado_espera = document.getElementById("resultado_espera");
        resultado_espera.innerHTML = `${averageWaitTime.toFixed(2)} segundos.`;

        const resultado_sistema = document.getElementById("resultado_sistema");
        resultado_sistema.innerHTML = `${averageSystemTime.toFixed(2)} segundos.`;
    }
    
}

function borrarDatos(){
    procesos = [];
    ordenarProcesos = [];
    index = 1;
    posicionActual = 0;
    tiempoProcesos = [];
    actualizarTablaProcesos(procesos);
    resultado_espera.innerHTML = `---`;
    resultado_sistema.innerHTML = `---`;
    quantum.setAttribute("disabled", "disabled");
    prioridad.setAttribute("disabled", "disabled");
    text_planificacion.innerHTML = `Planificacion:`;
    document.getElementById("quantum").value = "";
    mostrarGrafico();
}
    
