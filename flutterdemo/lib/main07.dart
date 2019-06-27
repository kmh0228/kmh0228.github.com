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
            title:Text('flutter demo')
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
      return ListView(
        padding:EdgeInsets.all(20),
        children: <Widget>[
          ListTile(
            leading: Icon(Icons.settings),
            title:Text('aaaaaaaaaaaaaaaaaaaaa'),
            subtitle:Text('bbbbbbbbbbbbbbb')
          ),
          ListTile(
            title:Text('aaaaaaaaaaaaaaaaaaaaa'),
            subtitle:Text('bbbbbbbbbbbbbbb')
          ),
          ListTile(
            title:Text('aaaaaaaaaaaaaaaaaaaaa'),
            subtitle:Text('bbbbbbbbbbbbbbb')
          ),
          ListTile(
            title:Text('aaaaaaaaaaaaaaaaaaaaa'),
            subtitle:Text('bbbbbbbbbbbbbbb')
          )
        ],
      );
    }
}