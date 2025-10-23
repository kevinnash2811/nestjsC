export interface IDocument {
	esquemaClienteID: string;
	esquemaDocumentalID: string;
	documentoID: string;
	documentoEsquemaID: string;
	documentoSolicitadoID: string;
	tipoDocumento: string;
	fechaRegistro: string;
	fechaLimitePresentacion: string;
	fechaDeVencimientoDelRespaldo: string;
	fechaRecordatorioRespaldo: string;
	fueEntregado: boolean; //
	esDevolucion: boolean; //
	fechaDevolucion: string; 
	esObligatorio: boolean; 
	urlImagenDocumento: string;
	esAbierto: boolean;
	tipoDeArchivo: string;
	idCliente: string;
	categoriaDocumento: string;
	nombreArchivo: string;
	organizacion: string;
	version: string;
	fechaActualizacion: string;
	archivoBase64?: string;
	mimeType?: string;
	esRespaldo?: boolean;
	documentRevisionId?: string;
}