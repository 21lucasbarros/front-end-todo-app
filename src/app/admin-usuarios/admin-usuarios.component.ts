import {
  Component,
  OnInit,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-admin-usuarios',
  standalone: false,
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css'],
})
export class AdminUsuariosComponent implements OnInit {
  @Output() fecharModal = new EventEmitter<void>();

  apiURL = 'https://apitarefaslucas235182-production.up.railway.app';
  usuarios: any[] = [];
  novoUsuario = { nome: '', senha: '', admin: false };
  mostrarErroCriacao: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  getHeaders(): HttpHeaders {
    const token = JSON.parse(
      localStorage.getItem('tokenJWT') || '{"token": ""}'
    ).token;
    return new HttpHeaders({ 'id-token': token });
  }

  carregarUsuarios() {
    this.http
      .get<any[]>(`${this.apiURL}/api/users`, { headers: this.getHeaders() })
      .subscribe((res) => (this.usuarios = res));
  }

  criarUsuario() {
    if (!this.novoUsuario.nome.trim() || !this.novoUsuario.senha.trim()) {
      this.mostrarErroCriacao = true;
      return;
    }

    this.mostrarErroCriacao = false;

    this.http
      .post(`${this.apiURL}/api/users`, this.novoUsuario, {
        headers: this.getHeaders(),
      })
      .subscribe(() => {
        this.carregarUsuarios();
        this.novoUsuario = { nome: '', senha: '', admin: false };
      });
  }

  salvarUsuario(usuario: any) {
    this.http
      .patch(`${this.apiURL}/api/users/${usuario._id}`, usuario, {
        headers: this.getHeaders(),
      })
      .subscribe(() => this.carregarUsuarios());
  }

  deletarUsuario(id: string) {
    this.http
      .delete(`${this.apiURL}/api/users/${id}`, { headers: this.getHeaders() })
      .subscribe(() => this.carregarUsuarios());
  }

  closeAdminPanel(event: MouseEvent) {
    event.stopPropagation();
    this.fecharModal.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.fecharModal.emit();
  }
}
