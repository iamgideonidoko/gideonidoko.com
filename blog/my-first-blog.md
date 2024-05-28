---
title: Singleton, Prototype & Builder Design Patterns in TypeScript
date: 2024-02-20
cover: /assets/img/BlogCoverDefault.jpg
description: Explore the advantages of TheScanr in the world of real estate QR code platforms. Discover its unique features that address common challenges faced by alternative solutions.
tags: [TheScanr, real estate QR codes, QR code platforms, real estate technology, QR code benefits, javascript, javascript]
---

There are some problems that have become common in the software engineering space because they've been solved x number of times by engineers in different projects. The solutions to these common problems were summed up as _Design Patterns_ in a 1994 published book titled **Design Patterns: Elements of Reusable Object-Oriented Software**. This book, after patterns became popular was tagged as "the Gang of Four (GoF) book" since it was authored by four (4) engineers namely: Erich Gamma, John Vlissides, Ralph Johnson, and Richard Helm.

A Design Pattern is simply a solution to a common problem in software engineering. Design Patterns as a set of tried and tested high-level solutions define a common language for efficient communication amongst engineering teammates. Some patterns are idioms (implementable in a single language only) while others are architectural (implementable in any language).

There are 23 Design patterns in the GoF book and they mainly solve object-oriented software design problems. These patterns are divided into three (3) categories based on their purpose:

- Creational Design Patterns: address object creation techniques.
- Structural Design Patterns: identify relationships between object structures.
- Behavioral Design Patterns: model software behaviour.

In this article, you'll learn about the Singleton, Prototype & Builder design patterns (all creational design patterns) and their respective sample implementation in TypeScript.

## Singleton Design Pattern

A Singleton is a class that only allows a single instance of it to be created. The Singleton Design Pattern ensures that a class has a single instance and global point of access that returns the instance when called.  For example, a shared resource like a database is most likely to have a class in the program that handles database-related logic like connection. Access to the database class should be controlled to avoid different parts of your program having different instances of the class. A Singleton can help in this case.

Below is a simple TypeScript implementation of a Singleton:

```typescript:title=adsf
// Database Singleton
class Database {
    /**
     * Prevent the instance from being accessed outside this class and its instances
     */
    private static db: Database;

    /**
     * Make the constructor only accessible within this class
     */
    private constructor() {}

    /**
     * Access point to the single instance
     */
    public static getDb(): Database {
        if (!Database.db) Database.db = new Database();
        return Database.db;
    }

    // ... other logic
}

(() => {
    const dbInstance1 = Database.getDb();
    const dbInstance2 = Database.getDb();
    console.log(dbInstance1 === dbInstance2 ? 'Same instance' : 'Different instances'); // Same instance

    const randomDbInstance = new Database(); /* ❌ Constructor of class 'Database' is private and only accessible within the class declaration. */
})();
```

NB: This pattern does not align with the _Single-responsibility principle_ (the S in SOLID principles) which states that each class should have a single purpose because all your database logic with diverse purposes will be in one class.

## Prototype Design Pattern

Prototype Design Pattern enables you to create a duplicate or clone of an existing object without having your code rely on its class. The object clone can be used as a prototype instance for creating other similar objects. For example, if a shopper wants to buy camping items for students where all students must have 5 same essential items and two optional ones of their choice. You can create a `Shopper` prototype class and an instance that will have a list of essential items that each student can clone and add their optional items. 

This can be implemented as below:

```typescript
interface CloneGetters {
    name: string;
    shoppingList: Array<string>;
}

/** Shopper prototype class */
class Shopper {
    private _studentName: string;
    private _shoppingList: Array<string>;

    public constructor(studentName = 'Unnamed Student') {
        this._studentName = studentName;
        this._shoppingList = [];
    }

    set studentName(value: string) {
        this._studentName = value;
    }

    get studentName() {
        return this._studentName;
    }

    get shoppingList() {
        return this._shoppingList.join(', ');
    }

    public addItemToList(item: string) {
        this._shoppingList.push(item);
    }

    /**
     * The clone method is a criteria for a prototype class
     * Object.create() help create a clone
     * Notice how non-primitive objects like _shoppingList is cloned.
     */
    public clone(): this & CloneGetters {
        const clone = Object.create(this);
        clone._shoppingList = Object.create(this._shoppingList);
        return clone;
    }
}

(() => {
    const shopper = new Shopper();
    shopper.addItemToList('Tent');
    shopper.addItemToList('Sleeping bag');
    shopper.addItemToList('Sleeping pad');
    shopper.addItemToList('Camping pillow');
    shopper.addItemToList('Headlamps');

    const abel = shopper.clone();
    abel.name = 'Abel Paul';
    abel.addItemToList('Hammock');
    abel.addItemToList('Camp rug');

    const grace = shopper.clone();
    grace.name = 'Grace Miller';
    grace.addItemToList('Cot');
    grace.addItemToList('Firewood');

    console.log('abel => ', abel.shoppingList); /** "abel => ",  "Tent, Sleeping bag, Sleeping pad, Camping pillow, Headlamps, Hammock, Camp rug" */
    console.log('grace => ', grace.shoppingList); /** "grace => ",  "Tent, Sleeping bag, Sleeping pad, Camping pillow, Headlamps, Cot, Firewood"  */
})();
```

**NB**: Complex objects or non-primitive values need special treatment when cloning them.

## Builder Design Pattern

Builder Design Pattern separates the construction of a complex object from its representation so that the same construction process can create different representations. This way, complex objects can be created step by step. 

For example, there are different persons like employees (part-time, managers, and so on) in a company or shoppers like in the previous pattern. A `Person` class can be used as a base class to represent a person in the real world. This means they will have different properties and probably similar ones too. You can use the Builder design pattern to ease up the creation of different persons without creating entirely new classes.

This can be implemented as below:

```typescript
interface IPerson {
    name: string;
    isEmployee: boolean;
    isManager: boolean;
    hours: number;
    money: number;
    shoppingList: Array<string>;
    toString: () => string;
}

interface Builder extends IPerson {   
    makeEmployee: () => Builder;
    makeManager: (hours: number) => Builder;
    makePartTime: (hours?: number) => Builder;
    withMoney: (money: number) => Builder;
    withList: (list: string[]) => Builder;
    build: () => IPerson;
}


class Person implements IPerson {
    public name: string;
    public isEmployee: boolean;
    public isManager: boolean;
    public hours: number;
    public money: number;
    public shoppingList: Array<string>;

    public constructor(builder: Builder) {
        this.name = builder.name;
        this.isEmployee = builder.isEmployee;
        this.isManager = builder.isManager,
        this.hours = builder.hours,
        this.money = builder.money,
        this.shoppingList = builder.shoppingList;
    }

    public toString(): string {
        return JSON.stringify(this);
    }
}

/** 
 * Builder class
 */
class PersonBuilder implements Builder {
    public name: string;
    public isEmployee = false;
    public isManager = false;
    public hours = 0;
    public money = 0;
    public shoppingList: Array<string> = [];

    public constructor(name: string) {
        this.name = name;
    }
    
    // .. construction logic
    
    public makeEmployee(): Builder {
        this.isEmployee = true;
        return this;
    }

    public makeManager(hours = 40) {
        this.isManager = true;
        this.hours = hours;
        return this;
    }

    public makePartTime(hours = 20) {
        this.hours = hours;
        return this;
    }

    public withMoney(money: number) {
        this.money = money;
        return this;
    }

    public withList(list: string[] = []) {
        this.shoppingList = list;
        return this;
    }

    public build(): IPerson {
        return new Person(this);
    }
}

(() => {
    // Build employees from Person with chained construction processes
    const james = new PersonBuilder('Sue').makeEmployee().makeManager(60).build();
    const angel = new PersonBuilder('Bill').makeEmployee().makePartTime().build();

    // Build shoppers from Person with chained construction processes
    const moses = new PersonBuilder('Charles')
        .withMoney(500)
        .withList(['jeans', 'sunglasses'])
        .build();
    const abby = new PersonBuilder('Tabbitha').withMoney(1000).build();

    console.log(james.toString()); /** 
    {"name":"Sue","isEmployee":true,"isManager":true,"hours":60,"money":0,"shoppingList":[]}
    */
    console.log(angel.toString()); /** 
    {"name":"Bill","isEmployee":true,"isManager":false,"hours":20,"money":0,"shoppingList":[]}
    */
    console.log(moses.toString()); /** 
    {"name":"Charles","isEmployee":false,"isManager":false,"hours":0,"money":500,"shoppingList":["jeans","sunglasses"]}
    */
    console.log(abby.toString()); /** 
    {"name":"Tabbitha","isEmployee":false,"isManager":false,"hours":0,"money":1000,"shoppingList":[]}
    */
})();
```
## Kindly Note

- Patterns are not algorithms that define a set of actions but more like a blueprint or high-level description of a solution. Hence, the order of implementation of a pattern might differ across multiple programs.
- Not all problems can be solved using the existing design patterns.
- Don't let the existing design patterns limit your creativity. You can come up with a pattern yourself if you deem it fit as a good solution to a recurring software design problem you've faced over time.
- Don't force the use of a pattern if it's not needed. Think before you use a design pattern to avoid unnecessary complexity in your software.


> _Design patterns should not be applied indiscriminately. Often they achieve flexibility and variability by introducing additional levels of indirection, and that can complicate a design and/or cost you some performance. A design pattern should only be applied when the flexibility it affords is actually needed._ ~  **Erich Gamma,** Design Patterns: Elements of Reusable Object-Oriented Software

## Wrapping Up
In this article, you were introduced to what design patterns are and how they came about. You learned about the classification of the design patterns defined in the GoF book. You further looked at the Singleton, Prototype & Builder creational design patterns and their respective sample implementation in TypeScript.

Thanks for reading :)

## Resources
- [Design Patterns by Refactoring Guru](https://refactoring.guru/design-patterns)
- [Wiki Page for Design Patterns](https://en.wikipedia.org/wiki/Software_design_pattern)
- [Design Patterns: Elements of Reusable Object-Oriented Software (The Book)](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
