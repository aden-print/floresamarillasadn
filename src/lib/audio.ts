// Motor de Audio con cancion personalizada, arranque en seg. 15, autoplay
class AmbientAudioEngine {
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private startOffset: number = 15; // segundos desde donde empieza

  private createAudio() {
    if (this.audioElement) return;
    const audio = new Audio('/floresamarillas.mp3');
    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = 'auto';
    audio.currentTime = this.startOffset;
    this.audioElement = audio;

    // Restaurar posicion si vuelve a empezar el loop
    audio.addEventListener('seeked', () => {
      // no-op, just to ensure it plays correctly
    });
    // Aseguramos que al hacer loop vuelva al segundo 15
    audio.addEventListener('timeupdate', () => {
      if (audio.currentTime < this.startOffset && audio.loop) {
        // Solo aplica si se reinicia (currentTime cayo a 0)
        // No hacer nada para no interferir con el seek del usuario
      }
    });
  }

  public play() {
    this.createAudio();
    if (!this.audioElement) return;
    // Forzar currentTime al offset solo si está al principio
    if (this.audioElement.currentTime < 1) {
      this.audioElement.currentTime = this.startOffset;
    }
    this.audioElement.play().catch(() => {
      // autoplay bloqueado por el navegador; se reintentara en el primer clic
    });
    this.isPlaying = true;
  }

  public stop() {
    if (!this.audioElement) return;
    this.audioElement.pause();
    this.isPlaying = false;
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  // Inicializar el elemento de audio sin reproducir (para preload)
  public preload() {
    this.createAudio();
  }
}

export const audioEngine = new AmbientAudioEngine();
