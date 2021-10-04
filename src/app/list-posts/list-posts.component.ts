import { Component, Input, OnInit } from '@angular/core';
import { IPost, IUser, IPhoto } from 'src/app/models/interfaces';
import { DataService } from '../services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-list-posts',
  templateUrl: './list-posts.component.html',
  styleUrls: ['./list-posts.component.scss']
})
export class ListPostsComponent implements OnInit {

  posts: IPost[] = [];
  users: IUser[] = [];
  photos: IPhoto[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    private listPostsActivatedRoute: ActivatedRoute,
    private titleService: Title
  ) {
    this.titleService.setTitle("Home");
  }

  ngOnInit(): void {

    this.dataService.getPosts();
    let id = this.listPostsActivatedRoute.snapshot.params.userID;
    this.dataService.posts$.subscribe(
      data => {
        if (data.length === 0) { return; }

        if (typeof id === 'undefined') { this.posts = data; }
        else { this.posts = data.filter((el: IPost) => el.userId === Number(id)); }


      }
    )
    this.dataService.getUsers();
    this.dataService.users$.subscribe(data =>
      this.users = data);

    this.dataService.getPhotos();
    this.dataService.photos$.subscribe(data =>
      this.photos = data);






    // this.dataService.posts$.subscribe(
    //   data=> {
    //     if(this.userID === undefined) {this.posts = data;}
    //     else {this.posts = data.filter(i=> i.userId==this.userID)}
    //   }
    // )

  }

  openPost(post: IPost) {
    this.router.navigate(['/posts', post.id]);

  }

  likePost(postid: any) {

    console.log(postid);
    console.log(this.isLiked(postid));
    if (!this.isLiked(postid)) {
      console.log(`liked post with id: ${postid}`);
      localStorage.setItem(String(postid), String(true));
      // let heart = document.getElementsByClassName("heart-icon") as HTMLCollectionOf<HTMLElement>;
      // heart[postid - 1].style.color = "#ff4081";
    }
    else {
      console.log(`unliked post with id: ${postid}`);
      localStorage.setItem(String(postid), String(false));
      // let heart = document.getElementsByClassName("heart-icon") as HTMLCollectionOf<HTMLElement>;
      // heart[postid - 1].style.color = "black";
    }

  }

  isLiked(postid: any) {
    let pom = localStorage.getItem(postid);
    if (pom === null) { return false; }
    else if (pom === "true") { return true; }
    else { return false; }

  }
}
