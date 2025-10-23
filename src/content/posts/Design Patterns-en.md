---
title: "Design Patterns in Java"
draft: false
published: 2025-03-12
tags: ["java", "swe", "design-patterns"]
description: "A comprehensive guide to understanding and implementing design patterns in Java, including creational, structural, and behavioral patterns."
---

![](https://5yyithvls1.ufs.sh/f/3nsI94TDxXoGu5NiATPw2RKvPU9nGi3dOrj1ZQ5msSeHtNkl)

# Creational Design Patterns

The creational design patterns are useful when you have to "create" something (lol).

They includes the following patterns:

- Factory Method
- Abstract Factory
- Builder
- Prototype
- Singleton

Nothing to say more about Creational Patterns in general since it's just "sugar syntax" to group design patterns into parent-classes of designs.

## Factory Method

The Factory Method is a Creational Design Pattern that comes in handy when the application requires the creation of the same object multiple times.

To avoid ripeat the logic of the creation of this particular object the Factory Method allows the developer to don't repeat himself.

In a one-line sentence the Factory Method allows the developer to hide the business logic of the creation of an object in the application

Based on that definition we could think that the Factory Method behaves in this kind of way:

- You have some sort of logic behind the creation of an Object
- You do want to avoid repetition
- You create a Factory Method to handle this

Let's see it with a quick example.

```java
class Prodcut {
 private int id;
 private int price;

  public Product(int id, int price) {
    this.id = id;
    this.price = price;
  }

}

class FactoryProduct {
  private static int currentId = 0;

  public static Product createProduct(int price) {
    currentId++;
    return new Product(currentId, price);
  }
}
```

This example is actually pretty stupid and probably also wrong in terms of logic.

The Factory Method capabilities do not stops here.

The Factory Method can be used to create objects of different classes that share the same parent class, or mor generally, the real benefits of the Factory Method are shown wiht polymorphism.

Let's see a more complex example.

Let's say you have a game in which you have to create space ships. The more the level of the game increases the more the space ships are powerful.

You could have a parent class `SpaceShip` and then you could have different classes that extends the `SpaceShip` class.

The Factory Method can be used to create the different space ships based on the level of the game.

```java
abstract class SpaceShip {
  private int health;
  private int damage;

  public SpaceShip(int health, int damage) {
    this.health = health;
    this.damage = damage;
  }

  public void attack() {
    System.out.println("Attacking with " + damage + " damage");
  }
}

class WeakSpaceShip extends SpaceShip {
  public WeakSpaceShip() {
    super(100, 10);
  }
}

class MediumSpaceShip extends SpaceShip {
  public MediumSpaceShip() {
    super(200, 20);
  }
}

class StrongSpaceShip extends SpaceShip {
  public StrongSpaceShip() {
    super(300, 30);
  }
}

class SpaceShipFactory {
  public static SpaceShip createSpaceShip(int level) {
    switch(level) {
      case 1:
        return new WeakSpaceShip();
      case 2:
        return new LevMediumSpaceShipel2SpaceShip();
      case 3:
        return new StrongSpaceShip();
      default:
        return null;
    }
  }
}
```

In this example whenver we need to create a new space ship we can use the `SpaceShipFactory` class to create the space ship based on the level of the game.

But let's say taht we also have to create Aliens in the game, also the Aliens increase their power based on the level of the game, but of course the aliens are not space ships, and they have different powers.

In that case the correct way to proceed is to create Factory based on the level of the game.

```java
class Alien {
  private int lifePoints;
  private int criticalDamage;

  public Entity(int lifePoints, int criticalDamage) {
    this.lifePoints = lifePoints;
    this.criticalDamage = criticalDamage;
  }

  public void attack() {
    System.out.println("Attacking with " + criticalDamage + " critical damage");
  }
}

class WeakAlien extends Alien {
  public WeakAlien() {
    super(100, 10);
  }
}

class MediumAlien extends Alien {
  public MediumAlien() {
    super(200, 20);
  }
}

class StrongAlien extends Alien {
  public StrongAlien() {
    super(300, 30);
  }
}
```

## Abstract Factory Method

We just decide, as shown before, that the game has different levels, and also has different entities that has some sort of power based on the level of the game.

In that case we could just create a new Factory for aliens and so having something like this:

```java example-bad
class AlienFactory {
  public static Alien createAlien(int level) {
    switch(level) {
      case 1:
        return new WeakAlien();
      case 2:
        return new MediumAlien();
      case 3:
        return new StrongAlien();
      default:
        return null;
    }
  }
}
```

> [!WARNING]
> This snippet of code is actually bad, because we are repeating the same logic of the `SpaceShipFactory` class.

Plus if we want to add a new level to the game we then have to edito both the `SpaceShipFactory` and the `AlienFactory` classes.

In that case so we have to shift our focus on problem and start thinking about the family of problem.

So the problem is that we have to create different entities based on the level of the game -> So we need a `LevelFactory`.

This `LevelFactory` will be `abstract` since it doesn't have any kind of **concrete implementation** but it just defines the methods that the concrete factories have to implement.

In that case our **concrete Factories** will be the `Level1Factory`, `Level2Factory` and `Level3Factory`.

Let's see the code:

```java
abstract class LevelFactory {
  abstract SpaceShip createSpaceShip();
  abstract Alien createAlien();
}

class Level1Factory extends LevelFactory {
  @override
  SpaceShip createSpaceShip() {
    return new WeakSpaceShip();
  }

  @override
  Alien createAlien() {
    return new WeakAlien();
  }
}

class Level2Factory extends LevelFactory {
  @override
  SpaceShip createSpaceShip() {
    return new MediumSpaceShip();
  }

  @override
  Alien createAlien() {
    return new MediumAlien();
  }
}

class Level3Factory extends LevelFactory {
  @override
  SpaceShip createSpaceShip() {
    return new StrongSpaceShip();
  }

  @override
  Alien createAlien() {
    return new StrongAlien();
  }
}
```

By doing that we actually create a solution for a set of problem (having more levels and more entities that depends on the level of the game), and we can easly add new levels to the game without headache and without going to change any client code that uses our **Factories** because in that case the benefit is that our _client_ doesn't have to depend on the concrete classes but just on the abstract classes.

In that example the benefit is clear:

```java

abstract class Level {
  private LevelFactory levelFactory;
  private String levelName;

  public Level(LevelFactory levelFactory, String levelName) {
    this.levelFactory = levelFactory;
    this.levelName = levelName;
  }
}

class Level1 extends Level {
  public Level1(LevelFactory levelFactory, String levelName) {
    super(levelFactory, levelName);
  }
}
```

An actual implementation of this would be:

```java
public class Main {
  public static void main(String[] args) {
    // assuming that the client choose the level 1
    Level1 level = new Level1(new Level1Factory(), "Level 1");
    SpaceShip spaceShip = level.createSpaceShip();
    Alien alien = level.createAlien();

    spaceShip.attack();
    alien.attack();
  }
}
```

## Builder

The Builder is a Creation Design Patterns very very useful and famous. It's mainly used when you have to _build_ an Object and its creation process may involves several steps (and not every step is required) that you want the client to abstract from.

A quick and most famous axample would be an `http` call in wich you have to "assemble" several pieces togheter (url, headers, body, etc...) in order to create a valid `http` request, but the deal is that not every `http` request needs to have a body, or headers, or a specific method, etc...

A quick example to get you in the mood:

```java
public static void main(String[] args) {
  HttpRequest request = new HttpRequest.Builder()
    .setUrl("https://api.example.com")
    .setMethod("GET")
    .setHeaders(new HashMap<String, String>() {{
      put("Authorization", "Bearer 123456");
    }})
    .build();
}
```

> [!NOTE]
> This is a quick example and it's not a real code that you can run, but it's just to give you an idea of how the Builder Pattern works.

Just for fun let's stick with the `SpaceShip` example. In the previous example we saw that a `SpaceShip` can have a `health` and a `damage` property. But now let's dive more into the concept of the `SpaceShip` itself, so more a place in which the atronauts can navigate into the sky and more.

So let's say we materially want to build the Space Ship, a spaceship needs several parts to be built, and not every part is required to build a spaceship.

In that case we can use the Builder Pattern to build the spaceship.

```java
class SpaceShip {
  private String name;
  private String model;
  private int crew;
  private int maxSpeed;
  private Srting fuel;
  private int health;

  public SpaceShip(String name, String model, int crew, int maxSpeed, String fuel, int health) {
    this.name = name;
    this.model = model;
    this.crew = crew;
    this.maxSpeed = maxSpeed;
    this.fuel = fuel;
    this.health = health;
  }
}

public interface Builder {
  void setName(String name);
  void setModel(String model);
  void setCrew(int crew);
  void setMaxSpeed(int maxSpeed);
  void setFuel(String fuel);
  void setHealth(int health);
}

class SpaceShipBuilder implements Builder {
  private String name;
  private String model;
  private int crew;
  private int maxSpeed;
  private String fuel;
  private int health;

  @override
  public void setName(String name) {
    this.name = name;
  }

  @override
  public void setModel(String model) {
    this.model = model;
  }

  @override
  public void setCrew(int crew) {
    this.crew = crew;
  }

  @override
  public void setMaxSpeed(int maxSpeed) {
    this.maxSpeed = maxSpeed;
  }

  @override
  public void setFuel(String fuel) {
    this.fuel = fuel;
  }

  @override
  public void setHealth(int health) {
    this.health = health;
  }

  public SpaceShip build() {
    return new SpaceShip(this.name, this.model, this.crew, this.maxSpeed, this.fuel, this.health);
  }
}
```

Of course in this case we are using primitives data types, but you can also build up more complex examples.

So couple of things to sum up:

- The `SpaceShip` class is the class that we want to build.
- The `Builder` interface - so the contract - that the `SpaceShipBuilder` class has to implement.
- An important method to keep in mind is the `buid()` method, that is the method that actually builds the `SpaceShip` object, basically what happens is that every time you `set` something, then the reference of the attribute of the class is updated and after all the sets, when you are done, you can call the `build()` method that will return the `SpaceShip` object with all the attributes setted.
- So if you are wondering how the builder remember everything...then the answer is that all the attributes are stored in-memory in the `SpaceShipBuilder` class.

A quick example of how to use the Builder Pattern:

```java
public static void main(String[] args) {
  SpaceShip spaceShip = new SpaceShipBuilder()
        .setName("SpaceX")
        .setModel("Falcon 9")
        .setCrew(4)
        .setMaxSpeed(1000)
        .setFuel("Kerosene")
        .setHealth(100)
        .build();
}
```

In conclusion the Builder Pattern is very useful to decouple (and abstract) the client from the object creation process, and most imporant to separate logic for certain objects that requires a lot of steps to be created.

> [!TIP]
> The Buidler Pattern is very used in Frameworks and Libraries, that most of the times abstract as much as possible for the developer to use the library.

## Prototype

The Prototype Pattern is a Creational Design Pattern that is used when you have to create a new object by copying an existing object without making your code dependent on their classes.

This pattern is per se very easy to understand and to apply, and it's also very handy for some scenarios in which you have to duplicate an object. When performing some business logic, the duplication of an objects is usually very common and so the Prototype Pattern solves the biolerplate code that you have to write to duplicate an object like `new` and the fact that you have to pass all the attributes of the object to the new object.

So let's say that you have a `SpaceShip` object and you want to duplicate it, you can use the Prototype Pattern to do that.

```java
class SpaceShip {
  private String name;
  private String model;
  private int crew;
  private int maxSpeed;
  private String fuel;
  private int health;

  public SpaceShip(String name, String model, int crew, int maxSpeed, String fuel, int health) {
    this.name = name;
    this.model = model;
    this.crew = crew;
    this.maxSpeed = maxSpeed;
    this.fuel = fuel;
    this.health = health;
  }

  public SpaceShip clone() {
    return new SpaceShip(this);
  }
}
```

This will also work for the class that inherits from the `SpaceShip` class.

```java
class WeakSpaceShip extends SpaceShip {
  public WeakSpaceShip(String name, String model, int crew, int maxSpeed, String fuel, int health) {
    super(name, model, crew, maxSpeed, fuel, health);
  }

  public WeakSpaceShip(WeakSpaceShip weakSpaceShip) {
    super(weakSpaceShip);
  }

  @override
  public SpaceShip clone() {
    return new WeakSpaceShip(this);
  }
}
```

So double ++ for that :D.

To conclude the Prototype Pattern do not need any kind of interface or abstract class, but it's just a method that you can add to your class to duplicate the object.

Eventualy you can also create an `Clonable` or `Prototype` interface that has the `clone()` method and then you can implement that interface in the class that you want to duplicate, but it's not that big of a deal!

## Singleton

The Singleton Pattern is one of the most abused pattern in the world of programming, and it's also one of the most famous.

It's very useful when you have to create an object that has to be unique across all the life-cycle of the application, so you have to create only one instance of that object.

Its implementation is very straightforward and make the job done without too much effort.

```java
class Singleton {
  private static Singleton instance;

  private Singleton() {}

  public static Singleton getInstance() {
    if (instance == null) {
      instance = new Singleton();
    }

    return instance;
  }
}
```

The Singleton Pattern is also very useful when you have to create a shared resource across the application, like a `Logger` or a `Database Connection`.

I don't think I need to make some sort of exmaple related to our **SpaceShip Game** because it's pretty clear how the music goes.

# Structural Design Patterns

The Structural Design Patterns are used to create a structure of objects in a way that they can work together in a more efficient way.

## Adapter

The Adapter Pattern is a Structural Design Pattern that allows objects with incompatible interfaces to work together.

Basically when you want to provide some sort of communication bwtween two objects that have different interfaces you can use the Adapter Pattern.

For example

- if you have an API that communicates via `XML` but you application communicates via `JSON` you can use the Adapter Pattern to make the two objects communicate.
- or if you have some legacy code in your application that you want to use but it's not compatible with the new code you can use the Adapter Pattern to make the two objects communicate.

These are just a couple of examples of how the Adapter Pattern can be used.

Sticking with the **SpaceShip Game** example, let's pretend that we have a `SpaceShip` class that has a `health` and a `damage` property, but we want to use the `SpaceShip` class in a game that has a `lifePoints` and a `criticalDamage` property.

In that case we can use the Adapter Pattern to make the two objects communicate.

```java
class SpaceShip {
  private int health;
  private int damage;

  public SpaceShip(int health, int damage) {
    this.health = health;
    this.damage = damage;
  }

  public fire() {
    System.out.println("Firing with " + damage + " damage");
  }
}

class Alien {
  private int lifePoints;
  private int criticalDamage;

  public Alien(int lifePoints, int criticalDamage) {
    this.lifePoints = lifePoints;
    this.criticalDamage = criticalDamage;
  }
}

class AlienAdapter extends SpaceShip {
  private Alien alien;

  public AlienAdapter(Alien alien) {
    super(alien.getLifePoints(), alien.getCriticalDamage());
    this.alien = alien;
  }
}
```

In this example the `AlienAdapter` class is the Adapter that allows the `SpaceShip` and the `Alien` class to communicate.

A quick example of how to use the Adapter Pattern:

```java
public static void main(String[] args) {
  Alien alien = new Alien(100, 10);
  AlienAdapter alienAdapter = new AlienAdapter(alien);
  // we can use the AlienAdapter as a SpaceShip
  alienAdapter.fire();
}
```

> [!NOTE]
> The Adapter Pattern doesn't need any kind of interface or abstract class since it's itself a child of a parent class, so it basically a smart way to use polymorphism and inheritance.

## Bridge

The Bridge Pattern is more an abstract concept than a real implementation. It's used when you have to decouple an abstraction from its implementation so that the two can vary independently.

For example when you have a monolith application and you want to split it into microservices, you can use the Bridge Pattern to decouple the abstraction from the implementation.
By doing that if you have a problem, or you have to make an improvement to the _AuthService_ you can do that without affecting the other services.

Or another more practical example is a **Cross Platform** framework that can compile on several platforms, in that case the Framework serves as an abstraction layer that avoids the developer to repeat the same functionality for each platform.

Say that, explaining what actually is a Bridge can be a bit tricky, but the concept is very simple.

To make it even more clear I would like to make a distinction between the Bridge Pattern and the Adapter Pattern.

The Adapter Pattern that we saw earlier is commonly used with an existing app or system in order to make some otherwise-incompatible classes work together, on the other hand the Bridge Pattern is used up front in the design of a system to let the developers works indipendently havving a bridge between the two.

## Composite

The Composite Pattern is a Structural Design Pattern that allows you to compose objects into tree structures to represent part-whole hierarchies.

So automatically this pattern is very used when in your application there's a well structured hierarchy of objects that you want to represent.

At first sight you may do not think about any real example of this pattern, it was the same for me before reading this example.

In some UI Framwork the UI components are rapresented in a tree-structure. Usually in these structure only the leaf nodes of the tree are responsible to the actually "paint on the canvas" (yes some UI Framworks actually paints pixels on a blank canvas, like Flutter for mobile development). In those scenarios as u might imagine the structure is something like this:

```
├── CustomButton
│   ├── Button
│       ├── Container
│           ├── Widget
│               ├── Element
│                   ├── RenderObject
│                       ├── RenderBox
```

This is just a made up example but the concept seems clear, the CustomButton is the root of the hierarchy and is the one that the user has defined on top of the Framework one ("Button"), and the Button is the one that the Framework has defined on top of the Container, and so on.

The RenderBox is the leaf node of the tree and is the one that actually paints on the canvas (or more professional way -> it render the object).

The point here is the fact that in a _class_ POV the CustomButton, Container, Widget and so on don't have any `render()` or `paint()` method, but they have a `child` property that is the reference to the next object in the hierarchy.

Of course a node can also have more than one child, but the point here is that only the leaf are the concrete _painters_ of the thing in the UI.

The same concept you can apply to the `Dot` concept. A `Dot` can be a `Line` that can be a `Square` and so on.

## Decorator

The Decorator Pattern is a Structural Design Pattern that allows you to add new functionality to an existing object without altering its structure.

So you can consider it as a wrapper around an object that doesn't currently do what you need to do, so you use a Decorator, to _decorate_ the object and make it do what you need to do.

Usually when you need to extend the functionality of an object in the **OO** world you would use inheritance, it works great, but it has its caveats.

Sometimes happen that you have class `A` that is being extended in class `B` since you need more funcionality. The first limitation here is that class `A` doesn't do what class `B` does, so if you ever needs a class that does what class `A` and `B` does then you **CAN'T** create a class `C` that extends both `A` and `B`, that's the limitation of the inheritance (technically in Python you can do that, but it has it's own caveats too).

So we understood that inheritance doesn't solves all our problems, sometime you need to use **composition**.

The Decorator Pattern is a way to use composition to extend the functionality of an object.

Let's see an example with the `SpaceShip` game, let's imagine that in our game we have different space ships that can have different weapons, and we want to add a weapon to a space ship.

Normally you would do something like this:

```java
class SpaceShip {
  private Weapon weapon;

  public SpaceShip(Weapon weapon) {
    this.weapon = weapon;
  }

  public void fire() {
    weapon.fire();
  }
}

abstract class Weapon {
  public abstract void fire() {}
}

class LaserWeapon extends Weapon {
  @override
  public void fire() {
    System.out.println("Firing with laser");
  }
}

class RocketWeapon extends Weapon {
  @override
  public void fire() {
    System.out.println("Firing with rocket");
  }
}

class PlasmaWeapon extends Weapon {
  @override
  public void fire() {
    System.out.println("Firing with plasma");
  }
}
```

So far so good, if we want to add a special weapon to a space ship we can do it like that:

```java
public static void main(String[] args) {
  SpaceShip spaceShip = new SpaceShip(new LaserWeapon());
  spaceShip.fire();
}
```

But what if we want to add more than one weapon to a space ship? We can't do that with the current implementation.

So we can use the Decorator Pattern to solve this problem.

```java
class SpaceShip {
  private Weapon weapon;

  public SpaceShip(Weapon weapon) {
    this.weapon = weapon;
  }

  public void fire() {
    weapon.fire();
  }

  public void setWeapon(Weapon weapon) {
    this.weapon = weapon;
  }
}

// the rest of the weapons classes...

abstract class SpaceShipDecorator extends SpaceShip {
  protected SpaceShip wrappedSpaceShip;

  public SpaceShipDecorator(SpaceShip wrappedSpaceShip, Weapon weapon) {
    this.wrappedSpaceShip = wrappedSpaceShip;
    this.wrappedSpaceShip.setWeapon(weapon);
  }

  public void fire() {
    wrappedSpaceShip.fire();
  }
}
```

Okay but, how can we actually use it?

```java
public static void main(String[] args) {
  SpaceShip spaceShip = new SpaceShip(new LaserWeapon());
  // will fire laser
  spaceShip.fire();

  SpaceShip spaceShipWithRocket = new RocketWeaponDecorator(spaceShip, new RocketWeapon());
  // will fire rocket
  spaceShipWithRocket.fire();

  SpaceShip spaceShipWithPlasma = new PlasmaWeaponDecorator(spaceShipWithRocket, new PlasmaWeapon());
  // will fire plasma
  spaceShipWithPlasma.fire();
}
```

And that's it, very handy, very easy.

## Facade

The Facade Pattern is a pattern that handle the complex logic behind the scenes and provide a simple interface to the client.

Those _complex logic_ ofter comes from a libarary or a framework, and the **Facade** provides a simple and intuitive interface to handle it.

Let's say that in our game we have someway to start the engine of the `StarShip` and we have to do several things to start the engine, like check the fuel, check the battery, check the oxygen, etc...

In that case we can use the Facade Pattern to provide a simple interface to start the engine.

```java
class SpaceShip {
  private Engine engine;

  public SpaceShip(Engine engine) {
    this.engine = engine;
  }
}

class Engine {
  public void checkFuel() {
    System.out.println("Checking fuel");
  }

  public void checkBattery() {
    System.out.println("Checking battery");
  }

  public void checkOxygen() {
    System.out.println("Checking oxygen");
  }

  public void start() {
    System.out.println("Starting engine");
  }
}

class EngineStarter {
  private Engine engine;

  public EngineStarter(Engine engine) {
    this.engine = engine;
  }

  public void startEngine() {
    engine.checkFuel();
    engine.checkBattery();
    engine.checkOxygen();
    engine.start();
  }
}
```

Okay let's pretend for a minute that the engine is a bit more complex than this...But the point here is that the `EngineStarter` so our **Facade** is providing good **API** to start the engine.

Let's see it in action:

```java
public static void main(String[] args) {
  SpaceShip spaceShip = new SpaceShip(new Engine());
  EngineStarter engineStarter = new EngineStarter(spaceShip.engine);
  engineStarter.startEngine();
}
```

## Flyweight

The Flyweight Pattern is a Structural Design Pattern that allows you to share objects to reduce memory usage.

It basically enable use to avoid specifing some attributes of an object in multiple objects, but to share them in a common place.

Let's say for the SpaceShip game we have thousands of bullets being fired. Each bullet has a position, direction, speed, and appearance. The appearance (texture, color, shape) can be shared among many bullets to save memory.

```java
// Flyweight - shared bullet properties
class BulletType {
  private final String texture;
  private final String color;
  private final String shape;

  public BulletType(String texture, String color, String shape) {
    this.texture = texture;
    this.color = color;
    this.shape = shape;
  }
}

// Concrete bullet with unique state
class Bullet {
  private int x, y;  // position
  private int speed;
  private BulletType type; // shared flyweight

  public Bullet(int x, int y, int speed, BulletType type) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.type = type;
  }
}

// Factory to manage shared BulletTypes
class BulletFactory {
  private Map<String, BulletType> bulletTypes = new HashMap<>();

  public BulletType getBulletType(String texture, String color, String shape) {
    String key = texture + color + shape;
    if (!bulletTypes.containsKey(key)) {
      bulletTypes.put(key, new BulletType(texture, color, shape));
    }
    return bulletTypes.get(key);
  }
}
```

The reason behind the Factory is that we want to avoid creating the same `BulletType` object multiple times, and the factory here comes in handy since we separate this logic from the client.
If you are wondering why we are using a `Map` to store the `BulletType` objects, the answer is that we want to avoid creating the same `BulletType` object multiple times.

Usage example:

```java
BulletFactory factory = new BulletFactory();
BulletType laserType = factory.getBulletType("laser", "red", "line");

// Create many bullets sharing the same BulletType
List<Bullet> bullets = new ArrayList<>();
for (int i = 0; i < 1000; i++) {
  bullets.add(new Bullet(i, i, 10, laserType));
}
```

## Proxy

The Proxy Pattern enable to control the access to a specific object.

Okay but how? It provides a placeholder for this object that the developer want to protect, in order to delegat it to the proxy object.

The Proxy Pattern is used when you want to add some sort of logic before or after the access to an object.

For example you can use the Proxy Pattern to add some sort of logging before or after the access to an object.

Let's say that in our game we have a `SpaceShip` object that has a `health` and a `damage` property, and we want to log every time the `fire()` method is called.

In that case we can use the Proxy Pattern to log every time the `fire()` method is called.

```java
abstract class SpaceShip {
  public abstract void fire();
}

// The concrete Space Ship that can actually fire something
class LaserSpaceShip implements SpaceShip {
  @override
  public void fire() {
    System.out.println("Firing");
  }
}

class SpaceShipProxy implements SpaceShip {
  private SpaceShip spaceShip;

  public SpaceShipProxy(SpaceShip spaceShip) {
    this.spaceShip = spaceShip;
  }

  @override
  public void fire() {
    System.out.println("Logging before firing");
    spaceShip.fire();
    System.out.println("Logging after firing");
  }
}
```

In this example the `SpaceShipProxy` class is the Proxy that logs every time the `fire()` method is called.

A quick example of how to use the Proxy Pattern:

```java
public static void main(String[] args) {
  SpaceShip spaceShip = new LaserSpaceShip();
  SpaceShip spaceShipProxy = new SpaceShipProxy(spaceShip);
  spaceShipProxy.fire();
}
```

# Behavioral Design Patterns

The Behavioral Design Patterns are used to manage algorithms, relationships, and responsibilities between objects.

In this category of patterns there are the following patterns:

- Chain of Responsibility
- Command
- Iterator
- Mediator
- Memento
- Observer
- State
- Strategy
- Template Method
- Visitor

Let's see them.

## Chain of Responsibility

The Chain of Responsability is a Behavioral Design Pattern that allows you to pass a request along a chain of handlers.

What that means?

It means that you can have a chain of objects that can handle a request, and the request is passed along the chain until one of the objects in the chain handles the request.

With this pattern I take the permission to pick another example that is not related to the **SpaceShip Game**...I know, I know, forgive me.

The most intuitive way to represent Chain of Responsability for me is with the concept of `middleware` in a web server.

Usually a middleware, as the name suggest, is a middle layer between a _request_ and a _response_ in a web server, so it's a set of one or more actions that are performed before the request is handled and a response is fired.

In a web server you can have multiple middlewares that handle the request, and the request is passed along the chain until one of the middlewares pass the middlware to the concrete request handler.

Let's image that between our request and response, in order, we have to:

- Log the request
- Check if the user is authenticated
- Check if the user has the permission to access the resource
- Check if the user has the permission to perform the action

In that case we can use the Chain of Responsability Pattern to handle the request.

```java

class Request {}

abstract class Middleware {
  private Middleware next;

  public Middleware use(Middleware next) {
    this.next = next;
    return next;
  }

  public abstract boolean check(Request request);
}

class LogMiddleware extends Middleware {
  @override
  public boolean check(Request request) {
    System.out.println("Logging request");
    return next.check(request);
  }
}

class AuthMiddleware extends Middleware {
  @override
  public boolean check(Request request) {
    System.out.println("Checking authentication");
    return next.check(request);
  }
}

class PermissionMiddleware extends Middleware {
  @override
  public boolean check(Request request) {
    System.out.println("Checking permission");
    return next.check(request);
  }
}

class RoleMiddleware extends Middleware {
  @override
  public boolean check(Request request) {
    System.out.println("Checking role");
    return next.check(request);
  }
}
```

In this example the `LogMiddleware`, `AuthMiddleware`, `PermissionMiddleware`, and `RoleMiddleware` classes are the handlers that handle the request.

An example of how to use the Chain of Responsability Pattern:

```java
public static void main(String[] args) {
  Request request = new Request();
  Middleware middleware = new LogMiddleware();
  middleware
    .use(new AuthMiddleware())
    .use(new PermissionMiddleware())
    .use(new RoleMiddleware());

  middleware.check(request);
}
```

In this example the `LogMiddleware` class logs the request, the `AuthMiddleware` class checks if the user is authenticated, the `PermissionMiddleware` class checks if the user has the permission to access the resource, and the `RoleMiddleware` class checks if the user has the permission to perform the action.

So as you can see the "CoR" respects the Single Responsibility Principle, since each middleware has a single responsibility, and you can clearly define the order of execution of the middlewares, plus you can easily add or remove a middleware from the chain.

## Command

The Command Pattern is a Behavioral Design Pattern that allows you to encapsulate a request as an object, thereby allowing you to parameterize clients with queues, delayes, and various operations.

The Command itself is usally just an interface with a single method:

```java

interface Command {
  void run();
}
```

Then we can define concrete implementation of that interface for various kind of actions that we need to perform. In the case of the SpaceShip example let's says that we have some sort of cool interface to create a SpaceShip, so user can add various pieces to the SpaceShip like the kind of metal which the shape is built, the kind of weapon or the kind of driver.

````java

class SpaceShip {
  private String metal;
  private String weapon;
  private String driver;

  public SpaceShip(String metal, String weapon, String driver) {
    this.metal = metal;
    this.weapon = weapon;
    this.driver = driver;
  }

  public void launch() {
    System.out.println("Launching SpaceShip with " + metal + " metal, " + weapon + " weapon and " + driver + " driver");
  }
}
```

For each of these actions we can create a concrete command:

```java
class SetMetalCommand implements Command {
  private SpaceShip spaceShip;
  private String metal;
  public SetMetalCommand(SpaceShip spaceShip, String metal) {
    this.spaceShip = spaceShip;
    this.metal = metal;
  }

  @override
  public void run() {
    spaceShip.setMetal(metal);
  }
}

class SetWeaponCommand implements Command {
  private SpaceShip spaceShip;
  private String weapon;
  public SetWeaponCommand(SpaceShip spaceShip, String weapon) {
    this.spaceShip = spaceShip;
    this.weapon = weapon;
  }

  @override
  public void run() {
    spaceShip.setWeapon(weapon);
  }
}

class SetDriverCommand implements Command {
  private SpaceShip spaceShip;
  private String driver;
  public SetDriverCommand(SpaceShip spaceShip, String driver) {
    this.spaceShip = spaceShip;
    this.driver = driver;
  }

  @override
  public void run() {
    spaceShip.setDriver(driver);
  }
}
````

> [!NOTE]
> As you can see in this example is not the Command that do the logic of setting the metal, weapon or driver, but it's the `SpaceShip` class that has to do that, the Command just encapsulate the request to do that.

Then we can create an `Invoker` class that will be responsible to execute the commands:

```java
class Invoker {
  private Command command;
  public void setCommand(Command command) {
    this.command = command;
  }

  public void executeCommand() {
    command.run();
  }
}
```

An example of how to use the Command Pattern:

```java
public static void main(String[] args) {
  SpaceShip spaceShip = new SpaceShip();
  Invoker invoker = new Invoker();

  invoker.setCommand(new SetMetalCommand(spaceShip, "Titanium"));
  invoker.executeCommand();

  invoker.setCommand(new SetWeaponCommand(spaceShip, "Laser"));
  invoker.executeCommand();

  invoker.setCommand(new SetDriverCommand(spaceShip, "John Doe"));
  invoker.executeCommand();
}
```

> [!NOTE]
> In this example the "Client" of our application is the `main` method itself.

With this Invoker we can also create a queue of commands to be executed later, or we can create a history of commands to be undone.

```java

class Invoker {
  private List<Command> commandHistory = new ArrayList<>();
  public void setCommand(Command command) {
    this.commandHistory.add(command);
  }

  public void executeCommands() {
    for (Command command : commandHistory) {
      command.run();
    }
    commandHistory.clear();
  }

  public void undoLastCommand() {
    if (!commandHistory.isEmpty()) {
      commandHistory.remove(commandHistory.size() - 1);
    }
  }
}
```

This pattern is very useful when you want to decouple the object that invokes the operation from the one that knows how to perform it.

This will open up a world of endless possibility, like implementing a queue of commands, a history of commands to be undone, or even a remote control system.

So to be clear the process of **applying the Command Pattern** is:

1. Define the Command interface with a single method.
2. Create concrete Command classes that implement the Command interface.
3. Identify (or create) classes that will act as _senders_ of the commands.
4. Change the senders so they use Command objects instead of calling methods directly.

> [!NOTE]
> The Command Pattern is very useful in scenarios where you need to decouple the sender of a request from the receiver, or when you need to implement features like undo/redo, logging, or queuing of operations. But in our example we overcomplicated a simple scenario (creating a SpaceShip) just to show how the pattern works.

## Iterator

The Iterator Pattern is a Behavioral Design Pattern that allows you to traverse a collection of objects without exposing the underlying representation of the collection (list, stack, tree, etc..).

As hard as it might seem, the Iterator Pattern is very easy to understand and to implement. The key part is the "Collection" part, it's important to focus on that because the Iterator Pattern applies to collections of objects.

Collections are in each programming leanguage, and they are used to store multiple objects in a single object, such as an array, a list, a set, a map, a tree, etc...

The main problem with collections is that they have different ways to traverse (explore) the objects inside them.

The Iterataor Pattern in that case comes in handy since it provides a common Interface `Iteartor` that hase two simple methods that can be used to traverse the collection:

```java
interface Iterator<T> {
  boolean hasNext();
  T next();
}
```

The `hasNext()` method returns `true` if there are more elements in the collection, and the `next()` method returns the next element in the collection.

So now we can create a concrete implementation of the `Iterator` interface for our collection, let's say that in our application we are storing all the `SpaceShips` in the game, so the `Fleet` as a tree, since a fleet can have multiple fleets inside it.

```java
class SpaceShip {
  private String name;
  private String model;
  private int crew;
  private int maxSpeed;
  private String fuel;
  private int health;

  // constructor, getters and setters...
}
```

Now the `Fleet` class that will store all the `SpaceShips` in a tree structure **MUST** implements the `IterableCollection` interface that has the `createIterator()` method that returns an `Iterator` object.:

```java
interface IterableCollection<T> {
  Iterator<T> createIterator();
}
```

Now let's define the `Fleet` class:

```java
class Fleet implements IterableCollection<SpaceShip> {
  private List<SpaceShip> spaceShips = new ArrayList<>();
  private List<Fleet> fleets = new ArrayList<>();

  public void addSpaceShip(SpaceShip spaceShip) {
    spaceShips.add(spaceShip);
  }

  public void addFleet(Fleet fleet) {
    fleets.add(fleet);
  }

  @override
  public Iterator<SpaceShip> createIterator() {
    return new DepthFirstIterator(this);
  }

  public List<SpaceShip> getSpaceShips() {
    return spaceShips;
  }

  public List<Fleet> getFleets() {
    return fleets;
  }
}
```

Now based on our needs we can create as many as we want concrete implementation of the `Iterator` interface, for example we can create a `DepthFirstIterator` and a `BreadthFirstIterator` to traverse the tree in different ways.

```java
class DepthFirstIterator implements Iterator<SpaceShip> {
  private Stack<Object> stack = new Stack<>();
  private SpaceShip current;

  public DepthFirstIterator(Fleet fleet) {
    stack.push(fleet);
  }

  @Override
  public boolean hasNext() {
    while (!stack.isEmpty()) {
      Object top = stack.pop();
      if (top instanceof SpaceShip) {
        current = (SpaceShip) top;
        return true;
      } else if (top instanceof Fleet) {
        Fleet fleet = (Fleet) top;
        for (SpaceShip spaceShip : fleet.getSpaceShips()) {
          stack.push(spaceShip);
        }
        for (Fleet subFleet : fleet.getFleets()) {
          stack.push(subFleet);
        }
      }
    }
    return false;
  }

  @Override
  public SpaceShip next() {
    return current;
  }
}

class BreadthFirstIterator implements Iterator<SpaceShip> {
  private Queue<Object> queue = new LinkedList<>();
  private SpaceShip current;

  public BreadthFirstIterator(Fleet fleet) {
    queue.add(fleet);
  }

  @Override
  public boolean hasNext() {
    while (!queue.isEmpty()) {
      Object front = queue.poll();
      if (front instanceof SpaceShip) {
        current = (SpaceShip) front;
        return true;
      } else if (front instanceof Fleet) {
        Fleet fleet = (Fleet) front;
        for (SpaceShip spaceShip : fleet.getSpaceShips()) {
          queue.add(spaceShip);
        }
        for (Fleet subFleet : fleet.getFleets()) {
          queue.add(subFleet);
        }
      }
    }
    return false;
  }

  @Override
  public SpaceShip next() {
    return current;
  }
}
```

Now we can use both the `DepthFirstIterator` and the `BreadthFirstIterator` to traverse the `Fleet` in different ways.

```java
public static void main(String[] args) {
  Fleet fleet = new Fleet();
  fleet.addSpaceShip(new SpaceShip("Enterprise", "NCC-1701", 430, 9500, "Dilithium", 100));
  fleet.addSpaceShip(new SpaceShip("Defiant", "NX-74205", 50, 9000, "Antimatter", 100));

  Fleet subFleet = new Fleet();
  subFleet.addSpaceShip(new SpaceShip("Voyager", "NCC-74656", 150, 9000, "Dilithium", 100));
  fleet.addFleet(subFleet);

  System.out.println("Depth First Traversal:");
  Iterator<SpaceShip> depthFirstIterator = fleet.createIterator();
  while (depthFirstIterator.hasNext()) {
    SpaceShip ship = depthFirstIterator.next();
    System.out.println(" - " + ship.getName());
  }

  System.out.println("\nBreadth First Traversal:");
  Iterator<SpaceShip> breadthFirstIterator = new BreadthFirstIterator(fleet);
  while (breadthFirstIterator.hasNext()) {
    SpaceShip ship = breadthFirstIterator.next();
    System.out.println(" - " + ship.getName());
  }
}
```

## Mediator

Mediator is a behavioral design pattern that allows you to reduce the chaotic dependencies between objects. The pattern restricts direct communications between the objects and forces them to collaborate only via a mediator object.

The Mediator Pattern try to solves this issue by introducing a new Mediator Object that will handle the communication and the interactions between the objects.

The Mediator object is a simple interface that most of the times has only one method, that is the `notify()` method.

```java
interface Mediator {
  void notify(Object sender, Object event);
}
```

Then we can create as many concrete implementation of the `Mediator` interface as we want, based on our needs.

The concrete implementation of the `Mediator` are a bit more complex and they depends on the use case. Usually a concrete mediator class has all the dependencies of the objects that it has to mediate.

The objects that needs to mediate needs to have a reference of the `Mediator` interface (not the concrete mediator), this reference is usually passed in the constructor of the object and it will be used to notify the mediator when something happens.

Let's see an example with the SpaceShip game, let's say that we have a `SpaceShip` class that has a `fire()` method and a `takeDamage()` method, and we want to notify the `Fleet` when a `SpaceShip` fires or takes damage.

```java
class SpaceShip {
  private String name;
  private Mediator mediator;

  public SpaceShip(String name, Mediator mediator) {
    this.name = name;
    this.mediator = mediator;
  }

  public void fire() {
    System.out.println(name + " is firing");
    mediator.notify(this, "fire");
  }

  public void takeDamage(int damage) {
    System.out.println(name + " is taking " + damage + " damage");
    mediator.notify(this, "takeDamage");
  }
}
```

```java
class FleetMediator implements Mediator {
  private List<SpaceShip> spaceShips;

  public FleetMediator(List<SpaceShip> spaceShips) {
    this.spaceShips = spaceShips;
  }

  @override
  public void notify(Object sender, Object event) {
    if (event.equals("fire")) {
      System.out.println("FleetMediator: " + ((SpaceShip) sender).getName() + " has fired");
    } else if (event.equals("takeDamage")) {
      System.out.println("FleetMediator: " + ((SpaceShip) sender).getName() + " has taken damage");
    }
  }
}
```

An example of how to use the Mediator Pattern:

```java
public static void main(String[] args) {
  List<SpaceShip> fleet = new ArrayList<>();
  FleetMediator fleetMediator = new FleetMediator(fleet);

  SpaceShip enterprise = new SpaceShip("Enterprise", fleetMediator);
  SpaceShip defiant = new SpaceShip("Defiant", fleetMediator);
  fleet.add(enterprise);
  fleet.add(defiant);

  enterprise.fire();
  defiant.takeDamage(50);
}
```

This is a very basic example, leet's see a more complex one. Let's pretend we have to handle a chat room where multiple users can send messages to each other.

```java
class User {
  private String name;
  private Mediator mediator;

  public User(String name, Mediator mediator) {
    this.name = name;
    this.mediator = mediator;
  }

  public String getName() {
    return name;
  }

  public void sendMessage(String message) {
    System.out.println(name + " is sending message: " + message);
    mediator.notify(this, message);
  }
}

class ChatRoom implements Mediator {
  private List<User> users;

  public ChatRoom() {
    this.users = new ArrayList<>();
  }

  public void addUser(User user) {
    users.add(user);
  }

  @override
  public void notify(Object sender, Object event) {
    for (User user : users) {
      if (user != sender) {
        System.out.println(user.getName() + " received message: " + event);
      }
    }
  }
}
```

An example of how to use the Mediator Pattern in a chat room:

```java
public static void main(String[] args) {
  ChatRoom chatRoom = new ChatRoom(); // the mediator

  User alice = new User("Alice", chatRoom);
  User bob = new User("Bob", chatRoom);
  chatRoom.addUser(alice);
  chatRoom.addUser(bob);

  alice.sendMessage("Hello Bob!"); // The user do the concrete action, but the mediator handle the communication
  bob.sendMessage("Hi Alice!");
}
```

## Memento

Memento is a behavioral design pattern that allows you to capture and externalize an object's internal state so that the object can be restored to this state later, without violating encapsulation.

So basically the Memento Pattern is used to implement the undo/redo functionality in an application.

We have three main components in the Memento Pattern:

1. The Originator: the object whose state we want to save and restore, and is also the one who generates the state.
2. The Memento: the object that stores the internal past snapshots of state of the Originator, without exposing its implementation details, so that the Originator can restore its state from the Memento.
3. The Caretaker: the object that is responsible for storing and restoring the Mementos, often is used with the Command Pattern and the Command object is the Caretaker, its purpose is to create backups of the state, and undo/redo functionality.

Let's see an example with the SpaceShip game, let's say that we have a `SpaceShip` class that has a `health` property, and we want to save the state of the `SpaceShip` before taking damage, so that we can restore it later.

```java
// In this case SpaceShip is the Originator, the one who holds the state that is the health in our case
class SpaceShip {
    private int health;

    public SpaceShip(int health) {
        this.health = health;
    }

    public void setHealth(int health) {
        this.health = health;
    }

    public int getHealth() {
        return health;
    }

    public void restore(SpaceShipMemento memento) {
        this.health = memento.getHealth();
    }

    // Creates a memento with current state
    public SpaceShipMemento save() {
        return new SpaceShipMemento(health);
    }

    // Inner Memento class that stores the past state of the SpaceShip
    // This is used so the caregiver doesnt have access to the internal state of the SpaceShip
    public class SpaceShipMemento {
        private final int health;

        public SpaceShipMemento(int health) {
            this.health = health;
        }

        public int getHealth() {
            return health;
        }
    }
}


// Store previous mementos state and eventually restore them
class Caretaker {
    private Stack<SpaceShip.SpaceShipMemento> history = new Stack<>();

    public void save(SpaceShip spaceShip) {
        history.push(spaceShip.save());
    }

    public void undo(SpaceShip spaceShip) {
        if (!history.isEmpty()) {
            SpaceShip.SpaceShipMemento memento = history.pop();
            spaceShip.restore(memento);
        }
    }
}
```

## Observer

Observer is a behavioral design pattern that lets you define a subscription mechanism to notify multiple objects about any events that happen to the object they’re observing.

The Observer Pattern is used when you have a one-to-many relationship between objects, so when one object changes state, all its dependents are notified and updated automatically. This is a very common scenario so let's see how can we integrate it in the SpaceShip game.

Let's say that we have a `Fleet` class that has multiple `SpaceShip` objects, and we want to notify all the `SpaceShip` objects when the `Fleet` changes state, for example when a new `SpaceShip` is added to the `Fleet`.

```java
interface Observer {
  void update(String message);
}

// Handy interface for the Subject, the one that notify all the observers
interface Subject {
  void attach(Observer observer); // attach a new observer (subscriber) to the subject
  void detach(Observer observer); // detach an observer (subscriber) from the subject
  void notifyObservers(String message); // notify all the observers (subscribers) about an event
}

// In this case the Fleet is the Publisher (or Subject) that notify all the SpaceShip (Observers) when something happens
class Fleet implements Subject {
  private List<Observer> observers = new ArrayList<>();
  private List<SpaceShip> spaceShips = new ArrayList<>(); // The main state of the Fleet

  public void addSpaceShip(SpaceShip spaceShip) {
    spaceShips.add(spaceShip);
    // Notify all observers about the new SpaceShip
    notifyObservers("New SpaceShip added: " + spaceShip.getName());
  }

  public void importantFleetEvent(String event) {
    // Notify all observers about the important event
    notifyObservers("Important Fleet Event: " + event);
  }

  public void attach(Observer observer) {
    observers.add(observer);
  }

  public void detach(Observer observer) {
    observers.remove(observer);
  }

  public void notifyObservers(String message) {
    for (Observer observer : observers) {
      observer.update(message);
    }
  }
}

// Its the concrete Subscriber (Observer) that wants to be notified when something happens in the Publisher (Subject)
class SpaceShip implements Observer {
  private String name;

  public SpaceShip(String name) {
    this.name = name;
  }

  public void update(String message) {
    // can perform something when receiving the notification from the publisher (Fleet)
    System.out.println(name + " received message: " + message);
  }
}
```

An example of how to use the Observer Pattern:

```java
public static void main(String[] args) {
  Fleet fleet = new Fleet();
  SpaceShip ship1 = new SpaceShip("Ship 1");
  SpaceShip ship2 = new SpaceShip("Ship 2");

  fleet.attach(ship1);
  fleet.attach(ship2);

  fleet.addSpaceShip(new SpaceShip("Ship 3"));
  fleet.importantFleetEvent("Enemy fleet detected!");
}
```

Ofc also other entites can be attached to the `Fleet` and be notified when something happens, for example a `FleetCommander` class that wants to be notified when a new `SpaceShip` is added to the `Fleet`.

```java
class FleetCommander implements Observer {
  private String name;

  public FleetCommander(String name) {
    this.name = name;
  }

  public void update(String message) {
    // can perform something when receiving the notification from the publisher (Fleet)
    System.out.println(name + " received message: " + message);
  }
}
```

An example of how to use the Observer Pattern with the `FleetCommander`:

```java
public static void main(String[] args) {
  Fleet fleet = new Fleet();
  SpaceShip ship1 = new SpaceShip("Ship 1");
  FleetCommander commander = new FleetCommander("Commander");

  fleet.attach(ship1);
  fleet.attach(commander);

  fleet.addSpaceShip(new SpaceShip("Ship 2"));
  fleet.importantFleetEvent("Enemy fleet detected!");
}
```

## State

State is a behavioral design pattern that allows an object to alter its behavior when its internal state changes. The object will appear to change its class.

Usually programs can be in different states, and based on the state the program can behave differently. Instead of handling the state with a lot of `if` or `switch` statements, we can use the State Pattern to handle the state in a more elegant way and scalable way.

We can define a `State` interface that has a method for each action that can be performed in the different states.

```java
interface State {
  void handle();
}
```

For example in our SpaceShip game we can have a `SpaceShip` class that can be in different states, such as `Idle`, `Flying`, `Attacking`, and `Damaged`.

```java
class SpaceShip {
  private State state;

  public SpaceShip() {
    this.state = new IdleState(this); // initial state
  }

  // logic to change the state
  public void setState(State state) {
    this.state = state;
  }

  // method to handle the state based on the current one
  // in our eample this will print something
  // but in a real game this will perform some concrete action
  public void handle() {
    state.handle();
  }
}
```

Then we can create concrete implementation of the `State` interface for each state.

```java
class IdleState implements State {
  private SpaceShip spaceShip;

  public IdleState(SpaceShip spaceShip) {
    this.spaceShip = spaceShip;
  }

  public void handle() {
    System.out.println("SpaceShip is idle.");
  }
}

class FlyingState implements State {
  private SpaceShip spaceShip;

  public FlyingState(SpaceShip spaceShip) {
    this.spaceShip = spaceShip;
  }

  public void handle() {
    System.out.println("SpaceShip is flying.");
  }
}

class AttackingState implements State {
  private SpaceShip spaceShip;

  public AttackingState(SpaceShip spaceShip) {
    this.spaceShip = spaceShip;
  }

  public void handle() {
    System.out.println("SpaceShip is attacking.");
  }
}

class DamagedState implements State {
  private SpaceShip spaceShip;

  public DamagedState(SpaceShip spaceShip) {
    this.spaceShip = spaceShip;
  }

  public void handle() {
    System.out.println("SpaceShip is damaged.");
  }
}

```

A more complex example would be to have the state directly tells if a `SpaceShip` can perform a specific action or not, for example if the `SpaceShip` is in the `DamagedState` it cannot `fly()` or `attack()`, but it can only `repair()`.

```java
interface State {
  void fly();
  void attack();
  void repair();
}
```

Now let's define the `SpaceShip` class:

```java
class SpaceShip {
  private State state;

  public SpaceShip() {
    this.state = new IdleState(this); // initial state
  }

  // logic to change the state
  public void setState(State state) {
    this.state = state;
  }

 // It's not the spaceship that handles the logic of the action, but it's the current state that handles it
 // so the system can behave differently based on the current state
  public void fly() {
    state.fly();
  }

  public void attack() {
    state.attack();
  }

  public void repair() {
    state.repair();
  }
}
```

Then we can create concrete implementation of the `State` interface for each state.

```java
class IdleState implements State {
  private SpaceShip spaceShip;

  public IdleState(SpaceShip spaceShip) {
    this.spaceShip = spaceShip;
  }
  public void fly() {
    System.out.println("SpaceShip is flying.");
    spaceShip.setState(new FlyingState(spaceShip));
  }

  public void attack() {
    System.out.println("SpaceShip is attacking.");
    spaceShip.setState(new AttackingState(spaceShip));
  }

  public void repair() {
    System.out.println("SpaceShip is already in good condition.");
  }
}

// ... other states with different logic implementation
```

## Strategy

The Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable. This pattern lets the algorithm vary independently from clients that use it.

In our SpaceShip example, we could use the Strategy pattern to define different flying behaviors.

```java
// Strategy contract
interface FlyStrategy {
  void fly();
}

// Concrete strategies implementing the FlyStrategy interface
class FlyWithWings implements FlyStrategy {
  public void fly() {
    System.out.println("Flying with wings!");
  }
}

class FlyWithFuel implements FlyStrategy {
  public void fly() {
    System.out.println("Flying with fuel!");
  }
}

// This calss is the context. Is the one that use the strategy
// and communicates with its object only via the strategy interface
class SpaceShip {
  private FlyStrategy flyStrategy;

  public SpaceShip(FlyStrategy flyStrategy) {
    this.flyStrategy = flyStrategy;
  }

  public void performFly() {
    flyStrategy.fly();
  }
}
```

And then we can use it like this:

```java
// In this case is the client of the strategy pattern
public static void main(String[] args) {
  SpaceShip birdShip = new SpaceShip(new FlyWithWings());
  birdShip.performFly(); // Output: Flying with wings!

  SpaceShip rocketShip = new SpaceShip(new FlyWithFuel());
  rocketShip.performFly(); // Output: Flying with fuel!
}
```

## Template Method

The teamplate method is a behavioral design pattern that defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.

This pattern is used when several classes uses the same algorithm, but with some variations in specific steps of the algorithm. So instead of duplicating the algorithm in each class, we can define the algorithm in a superclass and let the subclasses override the specific steps.

In our SpaceShip example, we could use the Template Method pattern to define a general algorithm for attacking, but let subclasses define specific attack strategies.

```java
abstract class SpaceShip {
  // Template method defining the skeleton of the algorithm
  public final void attack() {
    prepareForAttack();
    executeAttack();
    retreat();
  }

  protected abstract void prepareForAttack(); // Step to be implemented by subclasses
  protected abstract void executeAttack(); // Step to be implemented by subclasses

  private void retreat() { // Common step for all subclasses
    System.out.println("Retreating to safe distance.");
  }
}

// The concrete classes implement the specific steps of the algorithm
// The benefit is that those SpaceShips doesn't have to implement the whole attack algorithm
// just the part that is different
public class LaserSpaceShip extends SpaceShip {
  @Override
  protected void prepareForAttack() {
    System.out.println("Charging laser weapons.");
  }

  @Override
  protected void executeAttack() {
    System.out.println("Firing laser beams!");
  }
}

public class PlasmaSpaceShip extends SpaceShip {
  @Override
  protected void prepareForAttack() {
    System.out.println("Preparing plasma weapons.");
  }

  @Override
  protected void executeAttack() {
    System.out.println("Firing plasma blasts!");
  }
}

```

Now let's see how to use the Template Method pattern:

```java
public static void main(String[] args) {
  SpaceShip laserShip = new LaserSpaceShip();
  laserShip.attack();

  SpaceShip plasmaShip = new PlasmaSpaceShip();
  plasmaShip.attack();
}
```

## Visitor

The Visitor pattern is a behavioral design pattern that lets you separate algorithms from the objects on which they operate. It allows you to add new operations to existing object structures without modifying the structures.

The Visitor pattern is used when you have a complex object structure, and you want to perform operations on the objects in the structure without changing their classes. Instead of adding methods to the classes, you create a visitor class that implements the operations.

```java
interface Visitor {
  void visit(SpaceShip spaceShip);
  void visit(Fleet fleet);
}

interface Element {
  void accept(Visitor visitor);
}

class SpaceShip implements Element {
  private String name;

  public SpaceShip(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  public void accept(Visitor visitor) {
    visitor.visit(this);
  }
}

class Fleet implements Element {
  private List<Element> elements = new ArrayList<>();

  public void addElement(Element element) {
    elements.add(element);
  }

  public List<Element> getElements() {
    return elements;
  }

  public void accept(Visitor visitor) {
    for (Element element : elements) {
      element.accept(visitor);
    }
    visitor.visit(this);
  }
}

class FleetStatusVisitor implements Visitor {
  public void visit(SpaceShip spaceShip) {
    System.out.println("Visiting SpaceShip: " + spaceShip.getName());
  }

  public void visit(Fleet fleet) {
    System.out.println("Visiting Fleet with " + fleet.getElements().size() + " elements.");
  }
}

class FleetRepairVisitor implements Visitor {
  public void visit(SpaceShip spaceShip) {
    System.out.println("Repairing SpaceShip: " + spaceShip.getName());
  }

  public void visit(Fleet fleet) {
    System.out.println("Repairing Fleet with " + fleet.getElements().size() + " elements.");
  }
}

public static void main(String[] args) {
  Fleet fleet = new Fleet();
  fleet.addElement(new SpaceShip("Enterprise"));
  fleet.addElement(new SpaceShip("Defiant"));

  Fleet subFleet = new Fleet();
  subFleet.addElement(new SpaceShip("Voyager"));
  fleet.addElement(subFleet);

  FleetStatusVisitor statusVisitor = new FleetStatusVisitor();
  fleet.accept(statusVisitor);

  FleetRepairVisitor repairVisitor = new FleetRepairVisitor();
  fleet.accept(repairVisitor);
}
```
