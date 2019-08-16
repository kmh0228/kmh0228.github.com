import 'package:flutter/material.dart';

class Pages3 extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return GridView.count(
        crossAxisCount: 2,
        children: <Widget>[
          Container(
            width:200,
            height:200,
            color:Colors.red
          ),
          Container(
            width:200,
            height:200,
            color:Colors.blue
          ),
          Container(
            width:200,
            height:200,
            color:Colors.green
          )
        ],
      );
    }
}