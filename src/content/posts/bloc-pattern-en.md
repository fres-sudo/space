---
title: "How to use Bloc effectively"
published: 2026-02-01
draft: false
pin: 2
tags: ["Flutter", "Bloc", "State Management"]
description: "Learn how to use Bloc effectively in a Flutter application."
abbrlink: "bloc-pattern"
---

## How to use Bloc effectively

Bloc is a very widely used state manager in the Flutter community, but during my career I've seen many developers using it in a wrong way and the documentation is not very clear about how to use it effectively and how to architect a good application using Bloc.

In this article I'll try to explain **my** way of using Bloc to manage state in a Flutter application.

## What is Bloc?

**Bloc** (Business Logic Component) is a state management pattern that separates your app's business logic from the UI. It works by receiving events as input and emitting states as output, so the UI only listens to state changes and rebuilds accordingly. This keeps the code predictable, easy to test, and easy to maintain.

### Bloc vs Cubit

The Bloc library contains not only the `Bloc` class and all its related helpers, but also the `Cubit` class.

**Cubit** is a simpler, lighter alternative to Bloc. It's essentially Bloc without events: instead of emitting states in response to events, a Cubit exposes methods that you call directly, and those methods emit new states. Both Bloc and Cubit are part of the same `bloc` package and share the same underlying stream-based architecture.

**Main difference:** Bloc uses events as input; Cubit uses method calls. That makes Cubit simpler and less boilerplate-heavy, while Bloc gives you a more traceable, event-based history that's useful for debugging and logging. Here's what that looks like in code.

**Bloc** — events as input:

```dart
// Events
sealed class CounterEvent {}
class IncrementPressed extends CounterEvent {}
class DecrementPressed extends CounterEvent {}

// Bloc: maps events → states
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<IncrementPressed>((event, emit) => emit(state + 1));
    on<DecrementPressed>((event, emit) => emit(state - 1));
  }
}

// Usage
context.read<CounterBloc>().add(IncrementPressed());
```

**Cubit** — methods as input:

```dart
// Cubit: methods emit directly
class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);
  void increment() => emit(state + 1);
  void decrement() => emit(state - 1);
}

// Usage
context.read<CounterCubit>().increment();
```

- **When to use Cubit:** Prefer Cubit for straightforward flows where you don't need event-level visibility (e.g. simple forms, local UI state).
- **When to use Bloc:** Use Bloc when you need event traceability, complex flows with many event types, or when debugging and logging events is important (e.g. analytics, undo/redo, or large features with many interactions).

## Freezed and Equatable

Now that we have a basic understanding of what Bloc is, let's talk about the libraries that will help with the definition of our states and events.

- **Freezed** is a library that allows you to easily create immutable objects in Dart. It's a powerful tool that helps you manage states in your application.

- **Equatable** is a library that allows you to easily compare objects in Dart. It's a powerful tool that helps you manage state in your application.

### Why use Freezed or Equatable?

Bloc compares states with `==` to decide whether to notify listeners. If you use plain classes, two instances with the same data are treated as different (reference equality), so Bloc may emit "new" states that are logically unchanged and cause unnecessary rebuilds.

**Equatable** fixes this by letting you compare objects by their fields. When two states have the same values, they're considered equal—Bloc won't emit again, and your UI won't rebuild needlessly. It also reduces boilerplate for `==` and `hashCode`.

**Freezed** goes further: it generates immutable classes, `copyWith`, and often value equality as well. It excels at modeling states and events as union types (e.g. `Loading | Success(data) | Error`), so you get exhaustive pattern matching and clear, type-safe state definitions. Let's see the difference in code.

**Without Equatable** — reference equality causes extra emissions:

```dart
class UserState {
  final String name;
  UserState(this.name);
}
// UserState('Alice') != UserState('Alice')  → Bloc emits, UI rebuilds
```

**With Equatable** — value equality prevents unnecessary rebuilds:

```dart
class UserState extends Equatable {
  final String name;
  UserState(this.name);
  @override
  List<Object?> get props => [name];
}
// UserState('Alice') == UserState('Alice')  → no emit, no rebuild
```

**With Freezed** — union types, immutability, and `copyWith` in one:

```dart
@freezed
class UserState with _$UserState {
  const factory UserState.initial() = _Initial;
  const factory UserState.loading() = _Loading;
  const factory UserState.loaded(User user) = _Loaded;
  const factory UserState.error(String message) = _Error;
}
```

Together, they keep your states and events immutable, comparable by value, and easy to maintain, which aligns perfectly with Bloc's design and helps avoid bugs and performance issues.

### Why Immutability Matters for States and Events

Immutability means that once an object is created, it cannot be changed. To represent a new state, you create a new object instead of modifying the existing one. This might seem like extra work, but it has profound benefits for state management.

- **Predictability and traceability.** Each state is a snapshot in time. When something goes wrong, you can look at the state that was emitted and know exactly what the app was representing no hidden mutations after the fact. Bloc's event → state flow becomes a clear, auditable log: given these events, you get these states. With mutable objects, state can change from anywhere, at any time, making it nearly impossible to reason about what the UI was showing when a bug occurred.

- **No shared mutable state bugs.** When you pass a mutable object around, any widget, callback, or async operation can mutate it. Multiple parts of the codebase might read the "same" state while another part changes it, leading to race conditions, inconsistent UI, and bugs that only appear under certain timing. With immutability, once a state is emitted, it's frozen. Nobody can alter it. The only way to get a new state is for the Bloc to emit one—so there's a single, clear source of truth.

- **Safe async and concurrent code.** In async flows, mutable state can change between when you read it and when you use it. By the time a `Future` completes, the object you captured might have been modified. Immutable states eliminate this: the state you received is the state you have, forever. No one can change it from under you, which makes async logic much easier to reason about and debug.

- **Easier testing.** Immutable states and events are trivial to test. Create a state, pass it to a widget or validator, and it never changes. No test order dependencies, no setup/teardown for shared mutable globals, no flakiness from hidden state. You can assert on exact values and be confident nothing else modified them.

- **One-way data flow.** Bloc is built on the idea that state flows in one direction: Bloc emits, UI reacts. Immutability enforces this. The UI cannot accidentally mutate state; it can only dispatch events. The Bloc is the only place that produces new states. That constraint makes the architecture simple to understand and prevents entire classes of bugs (e.g. a widget "fixing" state locally and breaking other parts of the app).

- **Events should be immutable too.** Events represent "what happened" at a point in time. If an event could be mutated after being dispatched, the Bloc might process a different payload than what was originally sent, or the same event object could be reused and modified across multiple dispatches, leading to unpredictable behavior. Immutable events ensure each dispatch is a well-defined, unchangeable record of user intent or system input. Here's a visual contrast.

**Mutable** — dangerous, anyone can change it:

```dart
class BadState {
  List<User> users = [];  // mutable
}
// Some widget: state.users.add(newUser);  ← hidden mutation, hard to trace
```

**Immutable** — create new state instead:

```dart
class GoodState {
  final List<User> users;
  GoodState(this.users);
}
// New state: GoodState([...state.users, newUser])  ← explicit, traceable
```

**With Freezed `copyWith`** — ergonomic updates without mutating:

```dart
state.copyWith(users: [...state.users, newUser]);
```

In short, immutability turns state and events into stable, predictable values that flow through your app in a clear, auditable way. It's not just a style choice—it's what makes Bloc's architecture reliable and maintainable at scale.

### Sealed classes and Pattern Matching

Before Dart 3, modeling a finite set of states or events (e.g. `Loading | Success | Error`) required abstract classes with multiple implementations. The compiler couldn't know all possible subtypes, so you had to remember to handle every case manually—forgetting one often led to runtime errors or silent bugs. Dart 3 introduced **sealed classes** and **pattern matching**, which solve this at the language level.

- **What is a sealed class?** A sealed class is a superclass whose direct subtypes are known and restricted by the compiler. You declare all possible variants in the same library (or with `sealed`), and no one can add new subtypes elsewhere. For Bloc, that means your state can be `Loading`, `Success`, or `Error`—and the compiler knows that's the complete list.

- **How Freezed uses them.** Freezed generates sealed unions for you. When you define `@freezed` states like `Loading`, `Success(data)`, and `Error(message)`, Freezed produces a sealed class hierarchy. Each variant is a distinct subtype, and together they form a closed, exhaustively known set.

- **What is pattern matching?** Pattern matching lets you branch on the *shape* of a value—its type and fields—in a single expression. In Dart, you use `switch` (or `switch` expressions) with pattern matching: the compiler checks that you've handled every possible case. If you add a new state variant later and forget to handle it, you get a compile error instead of a runtime crash.

- **The real benefit.** Sealed classes + pattern matching give you **exhaustiveness checking**. When you `switch` on state, the compiler ensures you handle `Loading`, `Success`, and `Error`. Add a new variant like `Refreshing`? The compiler tells you exactly where you need to update your code. That turns "did I handle every case?" from a manual, error-prone checklist into something the compiler enforces—making your Bloc states safer and easier to evolve.

**Define states with Freezed:**

```dart
@freezed
class UserState with _$UserState {
  const factory UserState.initial() = _Initial;
  const factory UserState.loading() = _Loading;
  const factory UserState.loaded(User user) = _Loaded;
  const factory UserState.error(String message) = _Error;
}
```

**Pattern match in the UI** — the compiler enforces that all cases are handled:

```dart
return switch (state) {
  UserState.initial() => const Text('Tap to load'),
  UserState.loading() => const CircularProgressIndicator(),
  UserState.loaded(:final user) => Text(user.name),
  UserState.error(:final message) => Text('Error: $message'),
};
```

Add a new variant like `UserState.refreshing()`? The compiler will error until you handle it everywhere. That's the power of exhaustiveness checking—no forgotten cases at runtime.

## Multi-state vs Mono-state

There are two main ways to define Bloc state: **multi-state** (separate state classes for each variant, like union types) and **mono-state** (a single state class with variables inside—e.g. an enum for status plus nullable data and error fields). Both are valid, but they lead to different ergonomics in the Bloc and in the UI.

### Mono-state

One class, multiple variables:

```dart
class UserState {
  final UserStatus status;
  final User? user;
  final String? errorMessage;
  UserState({required this.status, this.user, this.errorMessage});
}
enum UserStatus { initial, loading, loaded, error }
```

- **The benefit**: fewer classes, simple to add new statuses.
- **The downside**: invalid combinations are possible (e.g. `status == loaded` but `user == null`), and the UI has to reason about which fields are valid for each status. You end up with `if (state.status == UserStatus.loaded && state.user != null)`—manual guards and a less expressive model of what the app state actually is.

### Multi-state

One variant per state, each with only the data it needs:

```dart
@freezed
class UserState with _$UserState {
  const factory UserState.initial() = InitialUserState;
  const factory UserState.loading() = LoadingUserState;
  const factory UserState.loaded(User user) = LoadedUserState;
  const factory UserState.error(String message) = ErrorUserState;
}
```

- **The benefit**: each state is self-describing. `UserState.loaded(user)` *always* has a user; `UserState.error(message)` *always* has a message. No null checks, no invalid combinations. The compiler and pattern matching enforce that you only access data when the state actually contains it.
- **The downside**: more classes, more boilerplate to add new statuses. And some ambiguity when defining read state and write state (will see that later).

I prefer **multi-state** for a more elegant UI and a more expressive way to model app states. The UI maps directly to the states: each branch of the `switch` handles exactly one meaningful state, and the data is available by construction. The code reads like "when initial, show this; when loading, show that; when loaded, show the user." It makes the flow of your app explicit and keeps the UI free of defensive null checks and status flags. Mono-state can work for very simple flows, but as complexity grows, multi-state scales better and stays easier to reason about.

### BlocBuilder and BlocListener with multi-state

**BlocBuilder** rebuilds the widget when the state changes. Use it for the visual representation of state—what the user sees. With multi-state, you typically `switch` on the state and return a widget for each variant. No `buildWhen` needed if you want to react to every state; use `buildWhen` only when you want to skip rebuilds for certain transitions (e.g. don't rebuild when going from `loading` to `error` if both show the same scaffold).

```dart
BlocBuilder<UserBloc, UserState>(
  builder: (context, state) => switch (state) {
    InitialUserState() => ElevatedButton(
        onPressed: () => context.read<UserBloc>().add(UserLoadRequested()),
        child: const Text('Load user'),
      ),
    LoadingUserState() => const Center(child: CircularProgressIndicator()),
    LoadedUserState(:final user) => UserProfile(user: user),
    ErrorUserState(:final message) => Text('Error: $message'),
  },
)
```

**BlocListener** runs side effects (snackbars, dialogs, navigation) when the state changes. It does *not* build widgets—it listens and reacts. Use it for one-time or ephemeral UI feedback that shouldn't be part of the widget tree (e.g. show a snackbar on error, navigate away on success). Prefer `listenWhen` to avoid running the same effect multiple times for the same logical event.

```dart
BlocListener<UserBloc, UserState>(
  listenWhen: (previous, current) => current case UserState.error(),
  listener: (context, state) => switch (state) {
    ErrorUserState(:final message) => ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    ),
    _ => null,
  },
  child: BlocBuilder<UserBloc, UserState>(...),
)
```

**BlocConsumer** combines both when you need listener and builder in the same place—side effects in `listener`, UI in `builder`. Use `listenWhen` and `buildWhen` to control when each runs.

```dart
BlocConsumer<UserBloc, UserState>(
  listenWhen: (prev, curr) => curr case UserState.error(),
  listener: (context, state) => switch (state) {
    ErrorUserState(:final message) => ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    ),
    _ => null,
  },
  builder: (context, state) => switch (state) {
    InitialUserState() => const Placeholder(),
    LoadingUserState() => const CircularProgressIndicator(),
    LoadedUserState(:final user) => UserProfile(user: user),
    ErrorUserState(:final message) => Text('Error: $message'),
  },
)
```

**Summary:** `BlocBuilder` = rebuild UI. `BlocListener` = side effects (snackbars, navigation). `BlocConsumer` = both. With multi-state, pattern matching keeps each branch clean and the compiler ensures you handle every case.

## CRUD structure: separating reads and writes

A clean way to structure CRUD is to split **reads** (the list) from **writes** (create, update, delete). Use a `[Feature]ListCubit` to stream or load the list, and a `[Feature]Bloc` for mutations. The UI uses `BlocListener` on the mutation Bloc to trigger side effects (e.g. refresh the list, show snackbars)—no need to couple the list logic to mutations.

### States and events

**ItemsListCubit** — read-only, holds the list:

```dart
@freezed
class ItemsListState with _$ItemsListState {
  const factory ItemsListState.initial() = InitialItemsListState;
  const factory ItemsListState.loading() = LoadingItemsListState;
  const factory ItemsListState.loaded(List<Item> items) = LoadedItemsListState;
  const factory ItemsListState.error(String message) = ErrorItemsListState;
}

class ItemsListCubit extends Cubit<ItemsListState> {
  final ItemsRepository _repo;

  ItemsListCubit(this._repo) : super(const ItemsListState.initial());

  Future<void> load() async {
    emit(const ItemsListState.loading());
    try {
      final items = await _repo.getItems();
      emit(ItemsListState.loaded(items));
    } catch (e) {
      emit(ItemsListState.error(e.toString()));
    }
  }

  void refresh() => load();
}
```

**ItemsBloc** — mutations only:

```dart
@freezed
class ItemMutationEvent with _$ItemMutationEvent {
  const factory ItemMutationEvent.create(Item item) = CreateItemMutationEvent;
  const factory ItemMutationEvent.update(Item item) = UpdateItemMutationEvent;
  const factory ItemMutationEvent.delete(String id) = DeleteItemMutationEvent;
}

@freezed
class ItemMutationState with _$ItemMutationState {
  const factory ItemMutationState.initial() = InitialItemMutationState;
  const factory ItemMutationState.creating() = CreatingItemMutationState;
  const factory ItemMutationState.createSuccess(Item item) = _CreateSuccess;
  const factory ItemMutationState.createError(String message) = CreateErrorItemMutationState;
  const factory ItemMutationState.updating() = UpdatingItemMutationState;
  const factory ItemMutationState.updateSuccess(Item item) = UpdateSuccessItemMutationState;
  const factory ItemMutationState.updateError(String message) = UpdateErrorItemMutationState;
  const factory ItemMutationState.deleting() = DeletingItemMutationState;
  const factory ItemMutationState.deleteSuccess(String id) = DeleteSuccessItemMutationState;
  const factory ItemMutationState.deleteError(String message) = DeleteErrorItemMutationState;
}

class ItemsBloc extends Bloc<ItemMutationEvent, ItemMutationState> {
  final ItemsRepository _repo;

  ItemsBloc(this._repo) : super(const ItemMutationState.idle()) {
    on<_Create>(_onCreate);
    on<_Update>(_onUpdate);
    on<_Delete>(_onDelete);
  }

  Future<void> _onCreate(_Create e, Emitter<ItemMutationState> emit) async {
    emit(const ItemMutationState.creating());
    try {
      final item = await _repo.create(e.item);
      emit(ItemMutationState.createSuccess(item));
    } catch (e) {
      emit(ItemMutationState.createError(e.toString()));
    }
  }
  // _onUpdate, _onDelete similar...
}
```

### UI: BlocListener triggers list refresh

When a mutation succeeds, the UI uses `BlocListener` to refresh the list—no coupling between `ItemsBloc` and `ItemsListCubit`. Side effects stay in the UI layer.

```dart
BlocListener<ItemsBloc, ItemMutationState>(
  listenWhen: (prev, curr) =>
      curr case ItemMutationState.createSuccess() ||
      curr case ItemMutationState.updateSuccess() ||
      curr case ItemMutationState.deleteSuccess(),
  listener: (context, state) {
    context.read<ItemsListCubit>().refresh();
    ScaffoldMessenger.of(context).showSnackBar(switch (state) {
      CreateSuccessItemMutationState() => const SnackBar(content: Text('Created')),
      UpdateSuccessItemMutationState() => const SnackBar(content: Text('Updated')),
      DeleteSuccessItemMutationState() => const SnackBar(content: Text('Deleted')),
      _ => null,
    });
  },
  child: BlocBuilder<ItemsListCubit, ItemsListState>(
    builder: (context, state) => switch (state) {
      InitialItemsListState() => const SizedBox(),
      LoadingItemsListState() => const Center(child: CircularProgressIndicator()),
      LoadedItemsListState(:final items) => ListView.builder(...),
      ErrorItemsListState(:final message) => Text(message),
    },
  ),
)
```

### CQRS-style: stream the list instead of fetching

You can go further with a CQRS-style read model: the list subscribes to a **stream** from the repository. When the backend or local store changes (e.g. after create/update/delete), the stream emits and the Cubit emits a new state. No manual `refresh()`—the list stays in sync automatically.

```dart
class ItemsListCubit extends Cubit<ItemsListState> {
  final ItemsRepository _repo;
  StreamSubscription<List<Item>>? _subscription;

  ItemsListCubit(this._repo) : super(const ItemsListState.initial());

  void watch() {
    emit(const ItemsListState.loading());
    _subscription?.cancel();
    _subscription = _repo.watchItems().listen(
      (items) => emit(ItemsListState.loaded(items)),
      onError: (e) => emit(ItemsListState.error(e.toString())),
    );
  }

  @override
  Future<void> close() {
    _subscription?.cancel();
    return super.close();
  }
}
```

With `watch()`, you call it once (e.g. when entering the screen). The repository's `watchItems()` stream (e.g. Firestore, Room, or a local reactive store) pushes updates whenever data changes. Mutations in `ItemsBloc` write to the same store; the stream emits, and the list updates. No `BlocListener` needed for refresh—though you may still use it for snackbars or navigation. The read model (list) and write model (mutations) are decoupled; the stream is the bridge.

---

Bloc is powerful when you lean into it: immutable, multi-state definitions with Freezed and Equatable, sealed classes and pattern matching for exhaustiveness, and a clear split between reads and writes. Use Bloc for traceable mutations, Cubit for simple reads. Let `BlocListener` handle side effects in the UI, and consider a CQRS-style stream for lists when your data source supports it. This is the approach I've found scales best—state stays predictable, the UI stays clean, and the compiler helps catch mistakes before they reach production. I hope it works for you too.
