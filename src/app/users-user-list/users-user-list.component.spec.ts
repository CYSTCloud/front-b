import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersUserListComponent } from './users-user-list.component';

describe('UsersUserListComponent', () => {
  let component: UsersUserListComponent;
  let fixture: ComponentFixture<UsersUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersUserListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
