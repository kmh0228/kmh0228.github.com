import 'package:flutter/material.dart';

void main(List<String> args) {
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

  var arr = [];
  List<Widget> _getData(){
    List<Widget> list= new List();
    for(var i = 0;i<20;i++){
      list.add(ListTile(
            title:Text('one'),
            subtitle:Text('ttttwo')
          ));
    }
    return list;
  }

  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return ListView(
        children: this._getData()
      );
    }
}