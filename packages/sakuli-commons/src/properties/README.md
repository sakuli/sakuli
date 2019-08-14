# Properties

To abstract application properties from there actual source (property-files, json-data, rc-files, etc) we divide property 
loading into two part:

- The loading which is handled by a [PropertySource](model/property-source.interface.ts)
- The actual mapping to a key [PropertyMap](model/property-map.interface.ts)
