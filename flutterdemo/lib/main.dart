import 'package:flutter/material.dart';
import './map/MapContainer.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: Text('地图测试'),
          ),
          body: MapContainer()
        ),
      );
    }
}