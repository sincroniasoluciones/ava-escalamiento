export interface Servicio {
  id: number;
  nombre: string;
  url: string;
  categoria: string;
  criticidad: 'Alta' | 'Media' | 'Baja';
  tecnologias: string[];
  descartes: string[];
  equipo_escalamiento: string;
  responsable: string;
  descripcion_cierre: string;
  guia_escalamiento: string;
}
