import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  filteredNotes: Note[] = new Array<Note>();
  // @ViewChild('filterInput') filterInputElemRef: ElementRef<HTMLInputElement>;

  constructor(private noteService: NotesService) { }

  ngOnInit(): void {

    // retrieve notes from note service

   this.notes =  this.noteService.getAll();
   this.filteredNotes = this.noteService.getAll();
  // this.filter('');

  }

  deleteNote(note: Note){
    let noteId = this.noteService.getId(note);
    this.noteService.delete(noteId);
    // this.filter(this.filterInputElemRef.nativeElement.value);
  }

  generateNoteURL(note: Note){
    let noteId = this.noteService.getId(note);
    return noteId;
  }

  filter(query:string){
    query = query.toLowerCase().trim();

    let allResults: Note[] = new Array<Note>();
    //split the query with individual words

    let terms: string[]=query.split(''); //split the spaces

    //remove the duplicate search terms
    terms = this.removeDuplicate(terms);

    //compile all relevent results into the array into the all results

    terms.forEach(term=>{
        let results: Note[] = this.releventNotes(term);
        //append results to the allresults array

        allResults=[...allResults,...results]
    });

    //all results will includes duplicate results
    //because a particular note can be results of many search terms
    //but we don't want to show the same note multiple times on the UI
    //so we first must remove the duplicates

    let uniqueResult = this.removeDuplicate(allResults);
    this.filteredNotes = uniqueResult;

    //now sort by relevent and pass the results



  }

  removeDuplicate(arr: Array<any>) : Array<any>{
      let uniqueResult: Set<any> = new Set<any>();

      //loop through the input array and add the items to the set
      arr.forEach(e=>uniqueResult.add(e))

      return Array.from(uniqueResult);
  }

  releventNotes(query: string) : Array<Note> {
    query = query.toLowerCase().trim();

    let releventNotes = this.notes.filter(note =>{
      if(note.title && note.title.toLowerCase().includes(query)){
        return true
      }
      if(note.body && note.body.toLowerCase().includes(query)){
        return true
      }

      else
      {
        return false
      }
    })
    return releventNotes;
  }

  sortByRelevent(searchResults:Note[]){
    let noteCountObj: Object= {}; //format - key:value=> NoteId:number(note object id: count)

    searchResults.forEach(note=>{
      let noteId = this.noteService.getId(note);

      if(noteCountObj[noteId]){
        noteCountObj[noteId]+=1;
      }
      else{
        noteCountObj[noteId] = 1;
      }
    })

    this.filteredNotes = this.filteredNotes.sort((a: Note,b: Note)=>{
      let aId = this.noteService.getId(a);
      let bId = this.noteService.getId(b);

      let aCount = noteCountObj[aId];
      let bCount = noteCountObj[bId];

      return bCount - aCount;
    })
  }

}
