import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  model: string;
  submitPrompt: string;
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      prompt: string;
      submitPrompt: string;
    }
  ) {
    this.model = data.prompt;
    this.submitPrompt = data.submitPrompt;
  }
}
