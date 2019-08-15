import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Scaffold(
          appBar: AppBar(
            title:Text('flutter demo')
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
      return Container(
        width:600,
        height:600,
        color: Colors.blue,
        child: Stack(
          alignment: Alignment(0,0),
          children: <Widget>[
            Container(
              width:300.0,
              height:300.0,
              color:Colors.red
            ),
            Align(
              alignment: Alignment(-1, -1),
              child:Text('data1')
            ),
            Align(
              alignment: Alignment(1, 1),
              child:Text('data2')
            )
          ],
        ),
      );
    }
}
