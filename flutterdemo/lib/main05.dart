import 'package:flutter/material.dart';

void main(){
  runApp(MyApp());
}

class MyApp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Scaffold(
          appBar:AppBar(
            title:Text('flutter Demo')
          ),
          body:HomeContent()
        )
      );
    }
}

class HomeContent extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Center(
            child:Container(
              child:Text(
                'flutter content',
                style:TextStyle(
                  fontSize: 40.0,
                  color:Colors.black,
                  decoration: TextDecoration.lineThrough
                )
              ),
              width:300.0,
              height:300.0,
              transform: Matrix4.rotationZ(0.5),
              decoration: BoxDecoration(
                color:Colors.pink,
                border:Border.all(
                  color:Colors.blue,
                  width:5.0
                ),
                borderRadius: BorderRadius.all(
                  Radius.circular(100.0)
                )
              ),
            )
          );
    }
}