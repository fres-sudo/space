---
title: "Design Patterns in Java"
draft: false
published: 2025-03-12
tags: ["java", "swe", "design-patterns"]
description: "A comprehensive guide to understanding and implementing design patterns in Java, including creational, structural, and behavioral patterns."
---

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

The Command Pattern is a Behavioral Design Pattern that allows you to encapsulate a request as an object, thereby allowing you to parameterize clients with queues, requests, and operations.

## Iterator

## Mediator

## Memento

## Observer

## State

## Strategy

## Template Method

## Visitor
Factory Method

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

The Command Pattern is a Behavioral Design Pattern that allows you to encapsulate a request as an object, thereby allowing you to parameterize clients with queues, requests, and operations.

## Iterator

## Mediator

## Memento

## Observer

## State

## Strategy

## Template Method

## Visitor
