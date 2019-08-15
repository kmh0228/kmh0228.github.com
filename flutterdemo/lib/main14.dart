import 'package:flutter/material.dart';

void main (){
  runApp(MyApp());
}

class MyApp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Scaffold(
          appBar: AppBar(
            title: Text('flutter title'),
          ),
          body:HomePage()
        ),
      );
    }
}

class HomePage extends StatefulWidget{
  _HomepageState createState() {return _HomepageState();}
}

class _HomepageState extends State<HomePage>{
  int countNum = 0;
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Column(
        children: <Widget>[
          Text('${this.countNum}'),
          RaisedButton(
            child: Text('anniu'),
            onPressed: (){
              setState((){
                this.countNum ++;
              });
            },
          )
        ],
      );
    }
}