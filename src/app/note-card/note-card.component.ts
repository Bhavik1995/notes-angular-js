import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() title: string;
  @Input() body: string;

  @ViewChild('trunCator',{static: true}) trunCator: ElementRef<HTMLElement>;
  @ViewChild('bodyText',{static: true}) bodyText: ElementRef<HTMLElement>;
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
    //work out if there is a test overflow and if not then hide truncator

    let style = window.getComputedStyle(this.bodyText.nativeElement, null);
    let viewableHeight = parseInt(style.getPropertyValue("height"),10);

    if(this.bodyText.nativeElement.scrollHeight > viewableHeight){
        //if the no text overflow, show the fade out truncator

        this.renderer.setStyle(this.trunCator.nativeElement, 'display','block');
    }
    else{
      //else (there is a text condition), hide the fade out truncator
      this.renderer.setStyle(this.trunCator.nativeElement, 'display','none');
    }
  }

    

}
