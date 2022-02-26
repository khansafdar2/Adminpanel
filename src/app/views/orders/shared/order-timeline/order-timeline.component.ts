import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { OrdersService } from '../../orders.service';

@Component({
  selector: 'order-timeline',
  templateUrl: './order-timeline.component.html',
  styleUrls: ['./order-timeline.component.scss']
})
export class OrderTimelineComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private orderService: OrdersService
  ) {}

  @Input() orderId = null;
  @Input() childOrderId = null;

  loading: boolean = false;
  history = [];
  commentForm = this.fb.group({
    order_id: [null],
    childorder_id: [null],
    message: ["", [Validators.required]]
  });

  getHistory() {
    this.loading = true;
    this.orderService.getOrderHistory(this.orderId, this.childOrderId).then(resp => {
      this.loading = false;
      if(resp) {
        this.history = resp.data;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.orderService.postComment(this.commentForm.value).then(resp => {
      this.loading = false;
      this.commentForm.patchValue({
        message: ""
      });
      this.commentForm.get("message").markAsPristine();
      this.getHistory();
    });
  }

  ngOnInit(): void {
    this.commentForm.patchValue({
      order_id: this.orderId,
      childorder_id: this.childOrderId
    });

    this.getHistory();
  }

}
