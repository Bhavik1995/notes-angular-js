import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NotesService } from 'src/app/shared/notes.service';
import { Note } from '../../shared/note.model';

@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss'],
  animations:[
    trigger('itemAnim',[
      //entry animation

      transition('void => *',[

      //intial state
      style({
          height: 0,
          opacity: 0,
          transform: 'scale(0.85)', 'margin-bottom': 0,
          paddingTop: 0,
          paddingRight: 0,
          paddingBottom: 0,
          paddingLeft: 0,
      }),
      animate('50ms',style({
        height: '*',
        'margin-bottom': '*',

        paddingTop: '*',
        paddingRight: '*',
        paddingBottom: '*',
        paddingLeft: '*',

      })),

      animate(68)
    ]),

    transition('* => void',[
      animate(50,style({
        transform: 'scale(1.05)'
      })),
      animate(50, style({
        transform: 'scale(1)',
        opacity: 0.75,
      })),
      animate('120ms ease-out',style({
          transform: 'scale(0.68)',
          opacity: 0,
      })),
      animate('150ms ease-out',style({
        height: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        'margin-bottom':'0',
      }))
    ])
  ]),

  trigger('listAnim',[
    transition('* => *',[
      query(':enter',[
        style({
          opacity: 0,
          height: 0,
        }),
        stagger(100,[
          animate('0.2s ease')
        ])
      ], {
        optional: true
      })
    ])
  ])
]
})
export class NotesListComponent implements OnInit {

  

  notes : Note[] = new Array<Note>();

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {

    // retrieve notes from note service

   this.notes =  this.noteService.getAll();

  }

  deleteNote(id: number){
    this.noteService.delete(id);
  }

}
