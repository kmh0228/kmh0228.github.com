import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Scaffold(
          appBar:AppBar(
            title:Text('flutter Demo')
          ),
          body:HomeConent()
        )
      );
    }
}

class HomeConent extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Center(
        //child:Expanded(child: new AndroidView(viewType: 'MapView')),
        child:Container(
          child: Expanded(child: new AndroidView(viewType: 'MapView')),
          height: 200,
          color:Colors.black
        )
      );
    }
}