import { Component, OnInit } from '@angular/core';
import MediumEditor from 'medium-editor';
import { AuthService } from '../shared/services/AuthServices';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss', ]
})
export class EditorComponent implements OnInit {

  constructor(public authService: AuthService) {
  }

  ngOnInit(): void {
    const editor = new MediumEditor('.editable');
  }

}
