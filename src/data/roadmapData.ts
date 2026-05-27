/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Phase } from '../types';

export const initialPhases: Phase[] = [
  {
    id: 0,
    number: 0,
    title: "Project Rules & Architecture Foundation",
    description: "Establish strict categorization, folder patterns, naming conventions, and Mover rules before spawning actors.",
    goal: "Define the structural backbone of the entire game project to prevent future rewrites, chaos, and system conflicts.",
    why_it_matters: "Everything depends on this phase: Actor systems, AI system, Interaction system, Save system, Movement logic (Mover), World design. If this is wrong → everything breaks later.",
    dependencies: [],
    blocked_by: [],
    milestones: [
      "Define actor classification system",
      "Define data-driven architecture rules",
      "Define folder structure",
      "Define naming conventions",
      "Define system boundaries (what owns what)",
      "Define “Mover rules” (movement authority rules)"
    ],
    examples: [
      "Rock = StaticInteractable -> no AI, no animation logic, only health + interaction.",
      "NPC = NPCActor -> AI allowed, perception allowed, state machine allowed."
    ],
    suggestions: [
      "Keep actor responsibilities strict. If an actor needs 3+ systems, split logic into components or data assets."
    ],
    common_mistakes: [
      "Mixing movement logic inside animation blueprints.",
      "Direct actor rotation overrides without coordinating with Mover.",
      "Hardcoding behaviors instead of configuring via data assets."
    ],
    architecture_notes: [
      "Rule: No feature logic outside its designated directory tree folder.",
      "Everything in the world must inherit from BP_WorldActor_Base or follow strict Phase 0 actor guidelines."
    ],
    validation_checklist: [
      "Every designed actor fits a specific category.",
      "No undefined hybrid actors exist.",
      "Folder structure is set up exactly as Core rules dictate."
    ],
    ai_prompts: [
      "Suggest standard data-driven values for medieval environment assets.",
      "Review my UE5 naming conventions to ensure they conform with Epic Games recommendations."
    ],
    estimated_time: "6h",
    difficulty: "Easy",
    progress: 0,
    notes: "",
    status: "Unlocked",
    tasks: [
      {
        id: "task_0_1",
        title: "Actor Classification System",
        description: "Specify structural boundaries and eligibility of all world entities: PlayerActor, NPCActor, StaticInteractableActor, DynamicInteractableActor, and WorldSystemActor.",
        why_this_exists: "Prevents actors from turning into bloated, unmaintainable hybrid classes with overlapping logic.",
        steps: [
          "Establish strict responsibilities for PlayerActor vs NPCActor.",
          "Prevent AI logic or perception sensors from being attached to StaticInteractables.",
          "Document eligibility rules for what actors can register for interfaces."
        ],
        subtasks: [
          { id: "sub_0_1_1", title: "Define actor representation classes & responsibilities", completed: false, estimated_effort: "30m", tags: ["Spec", "Doc"] },
          { id: "sub_0_1_2", title: "Review actor rules for StaticInteractable (no AI, health + interaction only)", completed: false, estimated_effort: "20m", tags: ["Physics", "Core"] },
          { id: "sub_0_1_3", title: "Draft structural interaction eligibility criteria", completed: false, estimated_effort: "20m", tags: ["Interface"] }
        ],
        notes: "",
        examples: [
          "Forest Pine Rock: StaticInteractable. StaticMeshComponent + InteractionComponent + HealthComponent + LootTableReference."
        ],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Putting pathfinding variables on static objects.", "Directly editing visual meshes in code instead of via blueprint construction scripts."],
        suggestions: ["Use Unreal GamePlayTags to identify active categories instead of hard class comparisons."],
        estimated_time: "1.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: [
          "No hybrid actors (e.g., breakable rocks carrying behavioral AI components) are permitted."
        ],
        ai_help_prompts: [
          "Show me an optimal blueprint component hierarchy for a static harvestable node.",
          "How can I lock down actor properties using C++ UP_PROPERTY specifiers?"
        ]
      },
      {
        id: "task_0_2",
        title: "Data-Driven Architecture Rules",
        description: "Define the DA_ActorDefinition DataAsset schema. Every actor should configure itself dynamically through static data references.",
        why_this_exists: "Eliminates rigid, hardcoded class settings, allowing team members to tweak parameters without breaking blueprints.",
        steps: [
          "Define ActorDefinition structure: Mesh, ActorType, HasAI, CanBeInteracted, Health.",
          "Configure dynamic construction script loops to load meshes and visual materials.",
          "Specify LootTable configurations and AI movement settings in the data asset template."
        ],
        subtasks: [
          { id: "sub_0_2_1", title: "Create DA_ActorDefinition base schema in editor", completed: false, estimated_effort: "45m", tags: ["DataAsset"] },
          { id: "sub_0_2_2", title: "Design structural connections for health config & loot tables", completed: false, estimated_effort: "45m", tags: ["Loot", "Specs"] }
        ],
        notes: "",
        examples: [
          "DA_IronNode: Mesh = SM_Iron_01, MaxHealth = 150.f, CanInteract = True, ToolRequired = IronPickaxe, ExperienceAwarded = 25"
        ],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Editing blueprints individually when balancing mining rates or loot drops."],
        suggestions: ["If behavior requires code edits instead of data edits, your architecture is too rigid."],
        estimated_time: "2h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: [
          "You can create a completely new collectible or breakable item simply by editing a DataAsset file without touching scripts."
        ],
        ai_help_prompts: [
          "Write a C++ class definition for UActorDefinition DataAsset including UProperty variables.",
          "What is the best way to handle nested Struct arrays inside an Unreal Data Asset?"
        ]
      },
      {
        id: "task_0_3",
        title: "Folder Structure Directory Setup",
        description: "Enforce strict filepath separations in the Content Browser.",
        why_this_exists: "Prevents asset drift, directory chaos, and lost references as the project climbs in scale.",
        steps: [
          "Create root directory structures: Core/, Characters/, AI/, Interaction/, World/, DataAssets/, Systems/, UI/, Inventory/.",
          "Formulate rule: No feature logic exists outside its designated functional directory path."
        ],
        subtasks: [
          { id: "sub_0_3_1", title: "Bake root directories in Unreal Content Browser", completed: false, estimated_effort: "15m", tags: ["Setup"] },
          { id: "sub_0_3_2", title: "Create core placeholder folders for inventory templates", completed: false, estimated_effort: "15m", tags: ["Assets"] }
        ],
        notes: "",
        examples: [
          "Correct Location: Content/Valmora/DataAssets/Trees/DA_OakTree.uasset",
          "Incorrect Location: Content/Valmora/Loose/DA_OakTree.uasset"
        ],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Loose assets in root, creating a 'Garbage Folder' which blocks packaging builds."],
        suggestions: ["Use color-coded folders in the Unreal Engine content drawer to visually emphasize active modules."],
        estimated_time: "1h",
        difficulty: "Easy",
        completed: false,
        priority: "Medium",
        validation_checklist: [
          "All folders created and zero unorganized files reside in the project hierarchy."
        ],
        ai_help_prompts: [
          "Generate a modular folder design for an Unreal Engine RPG featuring inventory, dialogue, and gear modules."
        ]
      },
      {
        id: "task_0_4",
        title: "Mover System Rule Definition",
        description: "Enforce authority protocols over actor movements.",
        why_this_exists: "Mover must maintain strict authority over character physics vectors. Manual rotation snapping bypasses replication and breaks animations.",
        steps: [
          "Establish Mover movement authority policy.",
          "Prevent direct actor transforms or manual actor rotation snaps.",
          "Define ControlRotation, OrientationIntent, and RotationMode metrics."
        ],
        subtasks: [
          { id: "sub_0_4_1", title: "Draft orientation intent policy mapping", completed: false, estimated_effort: "30m", tags: ["Mover", "Math"] },
          { id: "sub_0_4_2", title: "Create validation rules for orientation inputs", completed: false, estimated_effort: "30m", tags: ["Rules"] }
        ],
        notes: "",
        examples: [
          "Rule: Dynamic rotation must only feed intent values (Velocity intentions, Facing desires) to the Mover component."
        ],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using 'SetActorRotation' directly inside the input event graph instead of piping details via Mover."],
        suggestions: ["Study the Mover movement mode lifecycle inside Epic Games source before tweaking rotation math."],
        estimated_time: "1.5h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: [
          "Actor movement math resolves entirely within the Mover component pipeline, leaving characters jitter-free."
        ],
        ai_help_prompts: [
          "Explain the difference between ControlRotation and OrientationIntent inside Epic's Mover framework.",
          "How do I override facing direction without fighting network synchronization in UE5?"
        ]
      }
    ]
  },
  {
    id: 1,
    number: 1,
    title: "Character Foundation (Mover System)",
    description: "Build player avatar, cameras, and mover components. Configure movement inputs cleanly.",
    goal: "Create stable, reusable player character system using Mover.",
    why_it_matters: "All gameplay depends on character: combat, interaction, AI perception, movement feel, water system.",
    dependencies: ["Phase 0"],
    blocked_by: ["0"],
    milestones: [
      "Player character base setup",
      "Input system integration",
      "Camera system",
      "Movement validation",
      "Rotation system (Mover-driven)",
      "Interaction trace setup",
      "Animation placeholder integration"
    ],
    examples: [
      "Character movement feeds 'intent vectors' to Mover.",
      "Rotation resolves smoothly via interpolation curves."
    ],
    suggestions: [
      "Input should produce intent, not behavior.",
      "Keep character classes thin. Logic should live in components or subsystems."
    ],
    common_mistakes: [
      "Mixing animation logic directly inside the movement state machine.",
      "Overengineering movement buffers before movement states have stabilized.",
      "Fighting Mover system constraints instead of subscribing to input pipelines."
    ],
    architecture_notes: [
      "Character setup relies exclusively on Enhanced Input mapping assets.",
      "Base classes are written with extensibility in mind to support future swimming/combat modules easily."
    ],
    validation_checklist: [
      "Movement feels stable and consistent.",
      "Camera follows smoothly with no clipping issues in tight corners.",
      "Input is responsive with no lag."
    ],
    ai_prompts: [
      "Outline a clean Enhanced Input mapping setup for standard action triggers.",
      "Suggest rotation rates to avoid visual snapping when switching cameras."
    ],
    estimated_time: "15h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_1_1",
        title: "Base Player Character Base",
        description: "Create BP_PlayerCharacter_Base and attach Mover, CameraBoom, Capsule, and static meshes.",
        why_this_exists: "Establishes the absolute backbone of player-controlled physical assets.",
        steps: [
          "Instantiate BP_PlayerCharacter_Base matching naming rule format.",
          "Add CapsuleComponent and attach Mover component.",
          "Setup SpringArm components for stable default camera control."
        ],
        subtasks: [
          { id: "sub_1_1_1", title: "Create BP_PlayerCharacter_Base class", completed: false, estimated_effort: "45m", tags: ["Assets", "Core"] },
          { id: "sub_1_1_2", title: "Configure capsule sizing & attachment components", completed: false, estimated_effort: "30m", tags: ["Physics"] }
        ],
        notes: "",
        examples: ["Attachment Tree: CapsuleComponent -> MeshComponent -> SpringArm -> CameraComponent."],
        dependencies: ["task_0_1"],
        blocked_by: ["task_0_1"],
        common_mistakes: ["Putting movement variables outside Mover classes."],
        suggestions: ["Use inheritance (BP_PlayerCharacter_Base) to allow alternative character setups later."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Player spawns at coordinate benchmarks without tumbling or colliding incorrectly."],
        ai_help_prompts: [
          "Provide code for creating a character blueprint featuring standard cameras and spring arms."
        ]
      },
      {
        id: "task_1_2",
        title: "Enhanced Input System Mapping",
        description: "Bind character movement, camera rotation, jumping, and interaction keys using Unified Enhanced Input actions.",
        why_this_exists: "Encapsulates player control intention inside clean, swap-able input assets.",
        steps: [
          "Create Input Context maps (IMC_Default).",
          "Bind look vectors separate from movement speeds.",
          "Translate triggers into cleanly directed event structures."
        ],
        subtasks: [
          { id: "sub_1_2_1", title: "Create IMC_Default and input actions", completed: false, estimated_effort: "60m", tags: ["Input"] },
          { id: "sub_1_2_2", title: "Trigger control event bindings in blueprint", completed: false, estimated_effort: "30m", tags: ["Event Graph"] }
        ],
        notes: "",
        examples: ["IA_Move: Value Type = Vector2D, IMC_Default binds WASD to movement values."],
        dependencies: ["task_0_4"],
        blocked_by: ["task_0_4"],
        common_mistakes: ["Reading raw controller coordinates instead of decoupled input action structures."],
        suggestions: ["Remember: Input produces INTENT, not execution behavior."],
        estimated_time: "2h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Look actions, walk actions, and jumping registers correctly in diagnostic console debug checks."],
        ai_help_prompts: ["How do I setup Enhanced Input in a C++ actor component?"]
      },
      {
        id: "task_1_3",
        title: "Dampened Camera System",
        description: "Configure dampened spring-arms to handle vertical offsets, camera collisions, and obstruction sweeps.",
        why_this_exists: "Prevents immediate screen jitter or clipping when running near rocks, walls, or environmental obstacles.",
        steps: [
          "Setup horizontal/vertical camera dampening.",
          "Validate collision parameters (ECC_Camera checks block sweeps).",
          "Establish smooth zoom overrides during movement sprints."
        ],
        subtasks: [
          { id: "sub_1_3_1", title: "Configure camera collision test profiles", completed: false, estimated_effort: "30m", tags: ["Collision"] },
          { id: "sub_1_3_2", title: "Implement damping latency inside spring arm properties", completed: false, estimated_effort: "30m", tags: ["Math"] }
        ],
        notes: "",
        examples: ["Dampening Rate: Spring arm lag set to 6.f, ensuring a minor visual tailing during sudden strafe turns."],
        dependencies: ["task_1_1"],
        blocked_by: ["task_1_1"],
        common_mistakes: ["Using hard camera transitions that generate immediate physical snaps on collision hits."],
        suggestions: ["Always check 'Do Collision Testing' checkbox in your SpringArm components under Details panel."],
        estimated_time: "2h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Camera glides smoothly and never punches through solid static geometry boxes."],
        ai_help_prompts: ["How can I prevent UE5 cameras from clipping into low static obstacles?"]
      },
      {
        id: "task_1_4",
        title: "Rotation System (CRITICAL)",
        description: "Configure ControlRotation controls, OrientationIntent, and RotationMode metrics using standard interpolation.",
        why_this_exists: "Mover orientation must translate inputs elegantly without snapping, ensuring consistent facing states.",
        steps: [
          "Bake control rotation checks.",
          "Prevent characters from direct physical actor rot overrides.",
          "Implement OrientationIntent evaluation logic inside tick events."
        ],
        subtasks: [
          { id: "sub_1_4_1", title: "Setup orientation intent inside tick metrics", completed: false, estimated_effort: "60m", tags: ["Math", "Physics"] },
          { id: "sub_1_4_2", title: "Integrate spring rotation curves for stops/starts", completed: false, estimated_effort: "60m", tags: ["Curves"] }
        ],
        notes: "",
        examples: ["Mover orientation utilizes DeltaTime and smooth rotation rates (e.g., 360 degrees/second) for clean transitions."],
        dependencies: ["task_0_4", "task_1_2"],
        blocked_by: ["task_0_4", "task_1_2"],
        common_mistakes: ["Enabling 'Use Controller Rotation Yaw' inside the main blueprint which forces rigid actor snaps."],
        suggestions: ["If facing is inconsistent, fix input production variables instead of adjusting animation curves."],
        estimated_time: "3.5h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["Character faces directions gracefully based on keyboard/gamepad direction intents, without snaps."],
        ai_help_prompts: ["Write a blueprint rotation handler using Mover interface nodes."]
      },
      {
        id: "task_1_5",
        title: "Player Trace Placeholder",
        description: "Configure a screen or vector line trace extending from cameras targeting interaction vectors.",
        why_this_exists: "Provides a reliable baseline coordinate query for querying world object interactive states.",
        steps: [
          "Implement periodic line trace triggers in character tick routines.",
          "Structure default query profiles (ECC_Visibility sweep covering 250cm).",
          "Renders debug lines and log targeted objects."
        ],
        subtasks: [
          { id: "sub_1_5_1", title: "Build player trace logic on a periodic interval", completed: false, estimated_effort: "60m", tags: ["LineTrace"] },
          { id: "sub_1_5_2", title: "Renders debug trace points in standard preview sessions", completed: false, estimated_effort: "30m", tags: ["Debug", "Console"] }
        ],
        notes: "",
        examples: ["Line Trace trace vectors extend camera position + camera direct forward vector * 250.0."],
        dependencies: ["task_1_1"],
        blocked_by: ["task_1_1"],
        common_mistakes: ["Running line traces on every frame tick without decimation, increasing overhead."],
        suggestions: ["Run traces inside a shortTimer loop (0.1s interval) instead of on every tick event."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Trace locates static coordinates, and debug targets highlight cleanly."],
        ai_help_prompts: ["How do I run lightweight periodic line traces without lagging the update thread?"]
      },
      {
        id: "task_1_6",
        title: "Animation Placeholder Setup",
        description: "Bind basic state placeholders: Idle, Walk, Run, Jump, Fall.",
        why_this_exists: "Guarantees visual synchronization between physical movement states and bone animations.",
        steps: [
          "Create animation state machines.",
          "Feed speed checkpoints to transition lines.",
          "Add jump parameters mapped from Mover states."
        ],
        subtasks: [
          { id: "sub_1_6_1", title: "Instantiate Anim_Instance skeleton blueprints", completed: false, estimated_effort: "45m", tags: ["Anim"] },
          { id: "sub_1_6_2", title: "Connect velocity values to skeletal walk speeds", completed: false, estimated_effort: "45m", tags: ["Blendspace"] }
        ],
        notes: "",
        examples: ["Transition condition: IsMoving is True if Velocity Vector Length > 10.0f."],
        dependencies: ["task_1_1", "task_1_4"],
        blocked_by: ["task_1_1", "task_1_4"],
        common_mistakes: ["Overengineering full animation blend trees before establishing flat physical consistency."],
        suggestions: ["Use simple character mannequins with minimal blendspaces until physics coordinates are locked down."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "Low",
        validation_checklist: ["Visual states map nicely and character transitions without looping or flickering."],
        ai_help_prompts: ["Show me how to get movement vectors from Mover system to update an Animation Blueprint."]
      }
    ]
  },
  {
    id: 2,
    number: 2,
    title: "World Actor Foundation",
    description: "Design universal base class for world objects. Integrate dynamic DA configuration setup.",
    goal: "Create universal actor system for ALL world objects.",
    why_it_matters: "This becomes the backbone of: interaction, AI, save system, gameplay systems.",
    dependencies: ["Phase 1"],
    blocked_by: ["1"],
    milestones: [
      "Base world actor",
      "Actor definition system",
      "Interaction flags",
      "Health system integration",
      "AI toggle system",
      "Loot system structure"
    ],
    examples: [
      "Setting DataAsset dynamically adjusts visual meshes and collisions on construction.",
      "Base actor handles unified health component callbacks."
    ],
    suggestions: [
      "Everything in world should inherit from one predictable base (BP_WorldActor_Base).",
      "Do not write custom break/destruction logic on individual mesh scripts."
    ],
    common_mistakes: [
      "Hardcoding static meshes directly inside individual entity assets.",
      "Duplicating actor classes (e.g. CopperOre, TinOre) instead of parsing data variables."
    ],
    architecture_notes: [
      "BP_WorldActor_Base reads static data and populates collision, interactions, and visuals in construction.",
      "Eliminates class cast operations from core execution paths."
    ],
    validation_checklist: [
      "Mesh and parameters change dynamically based on DataAsset.",
      "Changing definitions on assets reflects perfectly on placement."
    ],
    ai_prompts: [
      "Review the BP_WorldActor_Base schema for decouple optimization.",
      "Draft a dynamic mesh selector based on data enum categories."
    ],
    estimated_time: "18h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_2_1",
        title: "Base World Actor creation",
        description: "Instantiate BP_WorldActor_Base featuring a StaticMesh, ID reference, and interaction parameters.",
        why_this_exists: "Guarantees every level entity subscribes to a predictable blueprint inheritance standard.",
        steps: [
          "Create BP_WorldActor_Base.",
          "Add DefaultSceneRoot and StaticMeshComponent.",
          "Add variable reference to DA_ActorDefinition."
        ],
        subtasks: [
          { id: "sub_2_1_1", title: "Create BP_WorldActor_Base asset", completed: false, estimated_effort: "30m", tags: ["Assets"] },
          { id: "sub_2_1_2", title: "Establish reference parameters for DataAssets", completed: false, estimated_effort: "30m", tags: ["Reference"] }
        ],
        notes: "",
        examples: ["Root -> Visual StaticMesh Component -> ID Tracking Component."],
        dependencies: ["task_0_1", "task_0_2"],
        blocked_by: ["task_0_1", "task_0_2"],
        common_mistakes: ["Putting asset-specific scripts inside the Base class which blocks simple overrides."],
        suggestions: ["Keep components lightweight and rely on data ingestion pipelines during level load stages."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Base actor compiling without errors and allows drag-dropping into default test scenes."],
        ai_help_prompts: ["How do I construct a base world object with component references in Unreal?"]
      },
      {
        id: "task_2_2",
        title: "Actor Definition Data Asset loading",
        description: "Integrate Construction Script variables so actors configuration automatically adjusts Mesh, Collisions, and Health pools from values in DA.",
        why_this_exists: "Removes design parameters from direct script scripts, allowing rapid balance adjustments.",
        steps: [
          "Write construction scripts that query selected DA variables.",
          "Adjust mesh scale and material overrides inside constructor routines.",
          "Configure collision curves (NPC, Inert, Vehicle, or Block)."
        ],
        subtasks: [
          { id: "sub_2_2_1", title: "Build construction script in BP_WorldActor_Base", completed: false, estimated_effort: "60m", tags: ["Construction Script"] },
          { id: "sub_2_2_2", title: "Connect visual overrides (materials + meshes) to scripts", completed: false, estimated_effort: "60m", tags: ["Visuals"] }
        ],
        notes: "",
        examples: ["Construction loads DA_OatNode -> Overrides static mesh with SM_Oat_Stage3 and sets health to 50."],
        dependencies: ["task_2_1"],
        blocked_by: ["task_2_1"],
        common_mistakes: ["Updating visual meshes during runtime tick instead of using Construction Scripts in editor."],
        suggestions: ["Verify that your data variables are set to 'Instance Editable' in the actor definition parameter graph."],
        estimated_time: "4h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Replacing the Active DataAsset dynamic update modifies visually in real-time in the editor window."],
        ai_help_prompts: ["How do I trigger mesh overrides dynamically inside construct events in Unreal?"]
      },
      {
        id: "task_2_3",
        title: "Interaction Flags configuration",
        description: "Integrate interaction permissions: CanInteract Boolean, interaction ranges, and type categories from DA definitions.",
        why_this_exists: "Preconditions actors for safe integration with upcoming interactive and HUD sweep networks.",
        steps: [
          "Bake toggle flags (CanInteract check).",
          "Map Enum classes (InteractionEnum: Harvest, Chest, Push, Speak).",
          "Assign range check values derived from actor parameters."
        ],
        subtasks: [
          { id: "sub_2_3_1", title: "Set interactive fields inside UActorDefinition class template", completed: false, estimated_effort: "45m", tags: ["Flags"] },
          { id: "sub_2_3_2", title: "Integrate range filters in Interaction validation rules", completed: false, estimated_effort: "45m", tags: ["Validators"] }
        ],
        notes: "",
        examples: ["If DA_Chest.CanInteract is true, trace systems allow interactions when within 200cm range limits."],
        dependencies: ["task_2_2"],
        blocked_by: ["task_2_2"],
        common_mistakes: ["Putting hard interaction collision sweeps on static objects instead of queries."],
        suggestions: ["Use simple vector distance checks between actors to validate interaction eligibility limits."],
        estimated_time: "3.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Actor registers range flags correctly and flags appropriate interaction text context."],
        ai_help_prompts: ["Design an scalable interaction sweep validator using gameplay tags."]
      },
      {
        id: "task_2_4",
        title: "Health system Component integration",
        description: "Append standard Health components to base world actors. Trigger damage and death callbacks.",
        why_this_exists: "Allows physical items to hold values, decay on hits, and trigger destruction effects.",
        steps: [
          "Construct and attach standard Health Component.",
          "Coordinate OnDamageReceived and ApplyDamage routines.",
          "Establish death sweeps and invoke visual effects."
        ],
        subtasks: [
          { id: "sub_2_4_1", title: "Create custom health structure or component class", completed: false, estimated_effort: "60m", tags: ["Component"] },
          { id: "sub_2_4_2", title: "Setup OnTakeDamage event links on Base class", completed: false, estimated_effort: "60m", tags: ["Events"] }
        ],
        notes: "",
        examples: ["A CooperOreNode gets damaged by player axes, deducts health, and fires particle impacts."],
        dependencies: ["task_2_1"],
        blocked_by: ["task_2_1"],
        common_mistakes: ["Putting health equations inside character scripts instead of in components."],
        suggestions: ["Keep components lightweight to avoid performance bottlenecks when loading large maps with many objects."],
        estimated_time: "4h",
        difficulty: "Medium",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Damaging objects reduces health correctly and cleanly triggers completion events on zero value."],
        ai_help_prompts: ["How do I create a versatile health component in Unreal C++?"]
      },
      {
        id: "task_2_5",
        title: "AI Toggle controller routing",
        description: "Route components dynamically: If AIEnabled field is true, spawn AI sensors; else, create inert world actors.",
        why_this_exists: "Maintains optimal server tick speeds by stripping heavy sensors from static objects.",
        steps: [
          "Check DA_ActorDefinition AI metrics.",
          "Instantiate and bind AI controllers and sensors.",
          "Strip collision sweeps from assets when AI stands deactivated."
        ],
        subtasks: [
          { id: "sub_2_5_1", title: "Build AI toggulator loops in event begin graphs", completed: false, estimated_effort: "60m", tags: ["AI Setup"] },
          { id: "sub_2_5_2", title: "Validate execution path on dynamic spawning", completed: false, estimated_effort: "30m", tags: ["Optimization"] }
        ],
        notes: "",
        examples: ["DA_Zombie has AIEnabled = True, appending perception sensors on spawn, whereas DA_Fence has AIEnabled = False, remaining inert."],
        dependencies: ["task_2_2"],
        blocked_by: ["task_2_2"],
        common_mistakes: ["Spawning complete decision trees or nav selectors for simple static items."],
        suggestions: ["Disable actor tick events dynamically if the object is static and inert."],
        estimated_time: "3.5h",
        difficulty: "Hard",
        completed: false,
        priority: "Medium",
        validation_checklist: ["AI variables accurately control actor initialization outputs when placed inside levels."],
        ai_help_prompts: ["How do I conditionally bind components in UE5 based on asset variables?"]
      }
    ]
  },
  {
    id: 3,
    number: 3,
    title: "Unique ID System",
    description: "Incorporate non-overlapping UUID persistent identities in Base World Actor to prepare for saving world states.",
    goal: "Give every world object a persistent identity.",
    why_it_matters: "Required for: save/load, destruction persistence, quests, interaction tracking.",
    dependencies: ["Phase 2"],
    blocked_by: ["2"],
    milestones: [],
    examples: [
      "ID: Level_Forest_PineRock_122_440",
      "Assigns permanent static identifiers inside construction routines."
    ],
    suggestions: [
      "IDs must never change once assigned.",
      "Integrate simple editor utility macros to quickly assign unique IDs in level designs."
    ],
    common_mistakes: [
      "Relying on transient Unreal Engine pointer values which shift on map restarts.",
      "Duplicating persistent IDs on copy-pasting objects inside levels."
    ],
    architecture_notes: [
      "Ensures that save systems can write values without matching coordinates or confusing duplicates."
    ],
    validation_checklist: [
      "Every world actor owns a stable UUID.",
      "Reloading levels preserves identical ID mapping lists."
    ],
    ai_prompts: [
      "Write an Unreal Editor Script utility to bake stable UUID tags.",
      "How can I manage ID tables securely under memory bounds?"
    ],
    estimated_time: "8h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_3_1",
        title: "Generate Unique ID",
        description: "Establish stable UUID or stable coordinates-based hashing algorithms.",
        why_this_exists: "Ensures save structures find precise physical maps on level loads.",
        steps: [
          "Bake hashing calculations utilizing LevelName + ClassName + coordinates.",
          "Prevent dynamic shifts in ID structures on sector updates.",
          "Validate formatting (UUID strings)."
        ],
        subtasks: [
          { id: "sub_3_1_1", title: "Build hash generator using coordinate structures", completed: false, estimated_effort: "45m", tags: ["Core Math"] },
          { id: "sub_3_1_2", title: "Setup GUID assignment structures", completed: false, estimated_effort: "45m", tags: ["UUID"] }
        ],
        notes: "",
        examples: ["PersistentID: ZoneA_BP_OakTree_X1245_Y9832."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using index IDs (e.g., Oak_1, Oak_2) which swap indexes on dynamic level streaming loads."],
        suggestions: ["Incorporate grid coordinate rounding to prevent floating-point shifts from breaking IDs."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Generator creates unique strings without intersections in high density blocks."],
        ai_help_prompts: ["How do I generate persistent identifiers in C++ that survive level restarts?"]
      },
      {
        id: "task_3_2",
        title: "Attach to every world actor",
        description: "Append ID parameters to BP_WorldActor_Base. Create automated editor triggers.",
        why_this_exists: "Guarantees that no entity is instantiated or placed without carrying its unique tag.",
        steps: [
          "Bind UniqueInstanceID variables in BP_WorldActor_Base.",
          "Program editor utilities to write persistent IDs on placement.",
          "Lock parameters from accidental manual adjustment edits."
        ],
        subtasks: [
          { id: "sub_3_2_1", title: "Setup UniqueInstanceID variable fields", completed: false, estimated_effort: "30m", tags: ["Actor Parameter"] },
          { id: "sub_3_2_2", title: "Instantiate editor utility execution checks", completed: false, estimated_effort: "60m", tags: ["Utility Hub"] }
        ],
        notes: "",
        examples: ["Unreal Editor Utility: OnActorPlaced -> AutoBakeGUID -> Save."],
        dependencies: ["task_3_1"],
        blocked_by: ["task_3_1"],
        common_mistakes: ["Copy-pasting actors along levels which replicates identical IDs across coordinates."],
        suggestions: ["Hook into GEditor->OnActorAdded to generate a pristine ID automatically."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Copying and pasting level actors generates a fresh, distinct GUID instantly."],
        ai_help_prompts: ["Draft an Editor utility blueprint that triggers custom GUID generation on actor placement."]
      },
      {
        id: "task_3_3",
        title: "ID Registration tracking mapping",
        description: "Design central maps that track located codes on level transitions.",
        why_this_exists: "Allows quest systems and save loaders to query actor states in memory.",
        steps: [
          "Construct registration lists in GameInstance registries.",
          "Setup OnActorSpawn and OnActorDestroyed registration sweeps.",
          "Eliminate orphaned ID mappings to clean memory."
        ],
        subtasks: [
          { id: "sub_3_3_1", title: "Declare registry lookup maps in GameState class", completed: false, estimated_effort: "45m", tags: ["Lookup Map"] },
          { id: "sub_3_3_2", title: "Connect actor spawn/destruction callbacks to maps", completed: false, estimated_effort: "45m", tags: ["Events"] }
        ],
        notes: "",
        examples: ["Registry: { 'ID_Oak_939': { HasBeenHarvested: true, CurrentHealth: 0.0 } }."],
        dependencies: ["task_3_2"],
        blocked_by: ["task_3_2"],
        common_mistakes: ["Keeping references to destroyed actors in memory, causing memory leaks."],
        suggestions: ["Utilize weak object pointers inside mapping collections to prevent memory leaks."],
        estimated_time: "2.5h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["Dynamic lookups retrieve targeted actor references quickly inside complex maps."],
        ai_help_prompts: ["How do I design a safe global database for trackable actor values in UE5?"]
      }
    ]
  },
  {
    id: 4,
    number: 4,
    title: "Interaction Framework",
    description: "Design standard system interfaces. Create dynamic HUD and display triggers.",
    goal: "One system for ALL interactions.",
    why_it_matters: "Every item uses the same interaction pipeline, eliminating class casting bottlenecks.",
    dependencies: ["Phase 2"],
    blocked_by: ["2"],
    milestones: [],
    examples: [
      "Rock -> Mine",
      "Door -> Open",
      "NPC -> Talk"
    ],
    suggestions: [
      "Incorporate robust Blueprint Interfaces (BPI) to bypass hard class casting.",
      "Decouple text display systems from direct interaction scripts."
    ],
    common_mistakes: [
      "Creating separate, custom interaction channels per object type.",
      "Casting to BP_Chest and BP_NPC separately in the player controller script."
    ],
    architecture_notes: [
      "BPI_Interactable overrides: CanInteract(), Interact(), GetInteractionData().",
      "Dynamic action dispatching ensures clean behavior delegation."
    ],
    validation_checklist: [
      "One uniform interface handles NPC conversations, locks, and mining nodes.",
      "Changing target types adjusts UI prompt indicators cleanly."
    ],
    ai_prompts: [
      "Recommend interactive interface schemas to avoid cyclical blueprint dependency locks.",
      "How can I manage custom UI prompts during trace updates?"
    ],
    estimated_time: "10h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_4_1",
        title: "BPI_Interactable Interface",
        description: "Integrate BPI_Interactable featuring CanInteract(), Interact(), and GetInteractionData() methods.",
        why_this_exists: "Allows different objects to define interactive triggers without hard couplings.",
        steps: [
          "Declare BPI_Interactable inside functional folders.",
          "Write method definitions and output parameters.",
          "Integrate interface structures in BP_WorldActor_Base."
        ],
        subtasks: [
          { id: "sub_4_1_1", title: "Create BPI_Interactable asset in editor", completed: false, estimated_effort: "30m", tags: ["Interface"] },
          { id: "sub_4_1_2", title: "Bind interface parameters to world base actor", completed: false, estimated_effort: "30m", tags: ["Integration"] }
        ],
        notes: "",
        examples: ["CanInteract() returns True if weapon is compatible. GetInteractionData() returns string context: '[E] Harvest Ore'."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Putting complex logic inside interfaces instead of using them purely for communication."],
        suggestions: ["Include variables for duration to allow for timed progress bars (e.g., harvesting for 3 seconds)."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Interface compiles correctly and appears in the class settings menu of base blueprints."],
        ai_help_prompts: ["How do I implement interface methods inside C++ actors?"]
      },
      {
        id: "task_4_2",
        title: "Player Trace loop integration",
        description: "Configure character trace sweeps to look for BPI interface attachments.",
        why_this_exists: "Allows players to focus on look vectors, query interactive properties, and trigger execution.",
        steps: [
          "Connect Periodic sweeps to trace placeholder calculations.",
          "Evaluate hit actors for BPI_Interactable compliance.",
          "Store active targets in player parameters."
        ],
        subtasks: [
          { id: "sub_4_2_1", title: "Write trace sweep functions inside Player class", completed: false, estimated_effort: "45m", tags: ["Trace Graph"] },
          { id: "sub_4_2_2", title: "Validate target interface compatibility checks", completed: false, estimated_effort: "45m", tags: ["Compliance"] }
        ],
        notes: "",
        examples: ["Sweeps find BP_TinNode, verifies BPI_Interactable interface, and caches target reference."],
        dependencies: ["task_4_1", "task_1_5"],
        blocked_by: ["task_4_1", "task_1_5"],
        common_mistakes: ["Writing traces inside input scripts instead of separating queries from executions."],
        suggestions: ["Cache the active target to avoid re-running trace scripts every frame when unchanged."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Cashing logic works cleanly, and log files report accurate targeted entities."],
        ai_help_prompts: ["How do I cast checking dynamically inside a vector sweep query?"]
      },
      {
        id: "task_4_3",
        title: "Interaction HUD display prompt",
        description: "Bake UI components that dynamically display prompt strings (e.g., '[E] Mine Stone').",
        why_this_exists: "Informs players when objects enter active ranges and displays contextual cues.",
        steps: [
          "Design interaction widget overlays.",
          "Bind UI prompts to data results from GetInteractionData().",
          "Animate transitions when entering/leaving object ranges."
        ],
        subtasks: [
          { id: "sub_4_3_1", title: "Build interaction prompt UI Widget", completed: false, estimated_effort: "45m", tags: ["UI", "Widget"] },
          { id: "sub_4_3_2", title: "Setup dynamic parameter bindings on HUD", completed: false, estimated_effort: "45m", tags: ["HUD Connection"] }
        ],
        notes: "",
        examples: ["Targeting DA_OatNode triggers prompt widget saying: '[E] Harvest Oats'."],
        dependencies: ["task_4_2"],
        blocked_by: ["task_4_2"],
        common_mistakes: ["Putting hardcoded UI strings on individual actor blueprints instead of querying them."],
        suggestions: ["Design a clean, responsive screen-center prompt overlay to minimize visual clutter."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Cues adapt dynamically when looking from chest boxes to NPC characters."],
        ai_help_prompts: ["Show me how to update overlay widgets dynamically in Unreal UI."]
      },
      {
        id: "task_4_4",
        title: "Action Dispatch delegation system",
        description: "Trigger action signals when players hit keys. Route interactions through the target's BPI script.",
        why_this_exists: "Ensures the interaction loop executes cleanly without direct class coupling.",
        steps: [
          "Map IA_Interact Enhanced Input events.",
          "Verify target CanInteract() variables.",
          "Fire Interact() and dispatch success parameters."
        ],
        subtasks: [
          { id: "sub_4_4_1", title: "Link dynamic action events to input contexts", completed: false, estimated_effort: "45m", tags: ["Input Events"] },
          { id: "sub_4_4_2", title: "Design execution loops with target BPI pipelines", completed: false, estimated_effort: "45m", tags: ["Execution"] }
        ],
        notes: "",
        examples: ["Pressing E triggers mine stone on StoneNode, spawning stone items in raw slots."],
        dependencies: ["task_4_2"],
        blocked_by: ["task_4_2"],
        common_mistakes: ["Performing calculations on the client instead of delegating updates directly to actors."],
        suggestions: ["Use robust dispatcher events to alert quest and save networks of interaction events."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Pressing keys triggers appropriate outcomes on dynamic switches without casting."],
        ai_help_prompts: ["How do I construct a decoupled interaction listener utilizing delegates?"]
      }
    ]
  },
  {
    id: 5,
    number: 5,
    title: "Water Interaction System",
    description: "Incorporate environmental physics volume triggers. Configure swimming motion modes in Mover components.",
    goal: "Environmental movement system.",
    why_it_matters: "Physics volume overrides can disrupt the standard Mover state loop. Setting up a dedicated swimming mode early secures responsive, float-correct game feel.",
    dependencies: ["Phase 1", "Phase 4"],
    blocked_by: ["1", "4"],
    milestones: [],
    examples: [
      "Character enters swimming state smoothly, applying buoyancy.",
      "Mover calculates water resistance curves on strafe turns."
    ],
    suggestions: [
      "Do not treat water as physics only. It is a movement state system.",
      "Check depth values to verify floating conditions before disabling gravity multipliers."
    ],
    common_mistakes: [
      "Updating physics properties inside general tick events instead of inside Mover state changes.",
      "Relying on raw gravity calculations which generate endless clipping snaps near the floor."
    ],
    architecture_notes: [
      "Water volume maps dynamically update active velocities inside the Mover component pipeline, leaving characters jitter-free."
    ],
    validation_checklist: [
      "Smooth visual transitions Land ↔ Water.",
      "Characters adjust gravity and swim speeds automatically inside fluid vectors."
    ],
    ai_prompts: [
      "How do I manage swimming states within the Epic Mover framework?",
      "Suggest buoyancy calculations for large water triggers."
    ],
    estimated_time: "12h",
    difficulty: "Hard",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_5_1",
        title: "Water Volume detection sweeps",
        description: "Bake Water Physics volumes and trigger overlap handlers.",
        why_this_exists: "Allows characters to detect fluid bounds and toggle swimming vectors.",
        steps: [
          "Create BP_WaterVolume utilizing Box collisions.",
          "Bind OverlapBegin and OverlapEnd callbacks on Player characters.",
          "Identify and catalog overlapping fluid depths."
        ],
        subtasks: [
          { id: "sub_5_1_1", title: "Create BP_WaterVolume classes with fluid templates", completed: false, estimated_effort: "45m", tags: ["Physics Volume"] },
          { id: "sub_5_1_2", title: "Link overlap boundaries on character base blueprints", completed: false, estimated_effort: "45m", tags: ["Events Graph"] }
        ],
        notes: "",
        examples: ["Overlapping BP_WaterVolume raises isOverlappingFluid to True and loads targeted depth."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using dynamic tick distance checks instead of standard physical triggers."],
        suggestions: ["Set collision parameters to trigger overlaps only with Player and NPC channels."],
        estimated_time: "2h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Visual tracers report accurate entrance overlaps in real-time play-test screens."],
        ai_help_prompts: ["How do I construct a lightweight fluid volume overlap sensor in C++?"]
      },
      {
        id: "task_5_2",
        title: "Swimming state transitions",
        description: "Configure transition events: EnterWater, InWater, ExitWater.",
        why_this_exists: "Manages character actions (disabling sprint, slowing moves) when crossing boundaries.",
        steps: [
          "Bake state machines for handling swim status indices.",
          "Apply friction multipliers on character speeds.",
          "Spawn simple water entry particles."
        ],
        subtasks: [
          { id: "sub_5_2_1", title: "Build swimming state controllers in character models", completed: false, estimated_effort: "45m", tags: ["State Engine"] },
          { id: "sub_5_2_2", title: "Trigger particle, splash sound overrides on boundaries", completed: false, estimated_effort: "45m", tags: ["FX"] }
        ],
        notes: "",
        examples: ["Entering water sets SpeedLimit = 250.f and launches water splash particle FX."],
        dependencies: ["task_5_1"],
        blocked_by: ["task_5_1"],
        common_mistakes: ["Using direct character velocity resets which create sudden snaps when swimming."],
        suggestions: ["Use smooth interpolation curves to ease character speeds into swimming ranges."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Spawning triggers fire cleanly on water contact without physical snaps or glitches."],
        ai_help_prompts: ["Show me how to build smooth state transitions on fluid entry."]
      },
      {
        id: "task_5_3",
        title: "Exit boundaries resolution",
        description: "Construct exit sweeps to resolve character land transitions.",
        why_this_exists: "Handles climbing curves or ledge checks when stepping out of fluid zones.",
        steps: [
          "Incorporate vertical tracers to measure surface offsets.",
          "Reset gravity scales on land transitions.",
          "Re-enable sprint, roll, and vault behaviors."
        ],
        subtasks: [
          { id: "sub_5_3_1", title: "Construct surface distance climb traces", completed: false, estimated_effort: "45m", tags: ["Climb Trace"] },
          { id: "sub_5_3_2", title: "Restore standard ground movement physics configs", completed: false, estimated_effort: "30m", tags: ["Math Overwrites"] }
        ],
        notes: "",
        examples: ["Stepping out of water resets MovementMode to walking and restores default friction factors (0.15f)."],
        dependencies: ["task_5_2"],
        blocked_by: ["task_5_2"],
        common_mistakes: ["Leaving gravity at swim rates, making characters float indefinitely on land of beaches."],
        suggestions: ["Trigger minor vertical velocity boosts to help characters step onto shore slopes easily."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Stepping onto beach slopes behaves smoothly, switching states back correctly."],
        ai_help_prompts: ["How do I resolve ledge climbing when transitioning from swimming to walking?"]
      },
      {
        id: "task_5_4",
        title: "Swimming input physics controllers",
        description: "Integrate swim movement variables: vertical drag forces, buoyancy scales, and speed rates.",
        why_this_exists: "Secures professional, float-correct mechanics for standard aquatic environments.",
        steps: [
          "Design vertical speed calculations based on look vectors.",
          "Formulate buoyancy rates to keep actors on water planes.",
          "Configure water resistance and linear drag dampening."
        ],
        subtasks: [
          { id: "sub_5_4_1", title: "Inject drag coefficients inside Mover equations", completed: false, estimated_effort: "60m", tags: ["Physics Engine"] },
          { id: "sub_5_4_2", title: "Implement buoyancy balancing to adjust surface position", completed: false, estimated_effort: "45m", tags: ["Floating Math"] }
        ],
        notes: "",
        examples: ["LinDrag set to 1.8f, Buoyancy factors calculate to keep character neck aligned with water levels."],
        dependencies: ["task_5_2", "task_1_2"],
        blocked_by: ["task_5_2", "task_1_2"],
        common_mistakes: ["Applying simplified gravity scales that create visual twitching when floating."],
        suggestions: ["Vary linear damping values based on swimming sprint inputs to reflect effort."],
        estimated_time: "3h",
        difficulty: "Hard",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Character floats correctly at water-level coordinate planes, with no jitter."],
        ai_help_prompts: ["Provide C++ buoyancy equations that balance physical variables in water."]
      },
      {
        id: "task_5_5",
        title: "Mover custom movement states logic",
        description: "Integrate swimming modes inside main Mover routing scripts.",
        why_this_exists: "Ensures that movement authorities synchronize swimming variables over network ticks.",
        steps: [
          "Register custom movement mode identifiers (Move_Swimming).",
          "Hook physics vectors up to Mover movement sweeps.",
          "Prevent other movement loops from conflicting with fluid vectors."
        ],
        subtasks: [
          { id: "sub_5_5_1", title: "Register Custom Movement Mode inside Mover Component", completed: false, estimated_effort: "45m", tags: ["Mover Config"] },
          { id: "sub_5_5_2", title: "Coordinate state overrides inside replication callbacks", completed: false, estimated_effort: "45m", tags: ["Sync Network"] }
        ],
        notes: "",
        examples: ["Mover shifts states, overriding ground sweeps in favor of multi-dimensional swimming math."],
        dependencies: ["task_5_4", "task_1_1"],
        blocked_by: ["task_5_4", "task_1_1"],
        common_mistakes: ["Manually editing coordinates during net updates, which triggers visual replication rollbacks."],
        suggestions: ["Rely exclusively on Mover class parameters to modify velocity coordinates."],
        estimated_time: "2h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["Mover system manages aquatic physics cleanly without triggering server correction rollbacks."],
        ai_help_prompts: ["How do I register a custom swimming physics loop inside Epic's Mover framework?"]
      }
    ]
  },
  {
    id: 6,
    number: 6,
    title: "Health, Damage & Destruction System",
    description: "Create a universal system for damage, health, destruction, death states, and world reactions.",
    goal: "Universal health and damage system to handle any actor health changes and death transitions.",
    why_it_matters: "This is used by combat, gathering, AI, environment interactions, and quests. Without it, no core gameplay loop exists.",
    dependencies: ["Phase 2 (World Actors)", "Phase 4 (Interaction Framework)"],
    blocked_by: ["2", "4"],
    milestones: [
      "Health component system",
      "Damage pipeline",
      "Death handling system",
      "Destruction behavior",
      "Loot trigger system",
      "State persistence integration"
    ],
    examples: [
      "Rock: Breaks into collectible ores on zero health.",
      "NPC: Rotates and transitions into a ragdoll or death state.",
      "Tree: Falls down and becomes an interactable stump."
    ],
    suggestions: [
      "Keep the health component completely separate from the actor class representing visuals or movement.",
      "Never mix raw skeletal mesh animations into generic health tracking routines."
    ],
    common_mistakes: [
      "Hardcoding death behavior inside the actor's damage handler instead of using delegators.",
      "Failing to separate general 'death' triggers from physical actor 'destruction' sweeps."
    ],
    architecture_notes: [
      "Generic health states belong purely inside UHealthComponent to maintain loose coupling guidelines.",
      "Damage equations subscribe to standard Unreal Engine structural channels."
    ],
    validation_checklist: [
      "Any world actor can receive and process incoming damage.",
      "Event dispatchers alert surrounding entities of variable health changes.",
      "Death sequences play cleanly, spawning correct resource items."
    ],
    ai_prompts: [
      "How can I decouple death events inside the Unreal Engine gameplay framework?"
    ],
    estimated_time: "10h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_6_1",
        title: "Generic Health Component",
        description: "Create UHealthComponent containing MaxHealth, CurrentHealth, and event dispatchers for health updates or death alerts.",
        why_this_exists: "Ensures health represents a completely reusable component which can be attached to any actor type.",
        steps: [
          "Instantiate Actor Component class UHealthComponent.",
          "Expose MaxHealth and CurrentHealth as editable parameters.",
          "Declare OnHealthChanged and OnDeath event dispatchers."
        ],
        subtasks: [
          { id: "sub_6_1_1", title: "Create UHealthComponent component files", completed: false, estimated_effort: "45m", tags: ["Assets", "Core"] },
          { id: "sub_6_1_2", title: "Bind OnHealthChanged dispatch parameters", completed: false, estimated_effort: "30m", tags: ["Math", "Events"] }
        ],
        notes: "",
        examples: ["Component lowers health to 75.f and triggers the OnHealthChanged dispatcher with delta -25.f."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Attaching health trackers exclusively to characters, preventing rocks from taking damage."],
        suggestions: ["Clamp health values strictly between 0 and MaxHealth on any incoming heal or damage vectors."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Health values subtract correctly, and the OnDeath dispatcher alerts when values reach zero."],
        ai_help_prompts: ["How do I invoke event dispatchers on health changes inside a Component?"]
      },
      {
        id: "task_6_2",
        title: "Comprehensive Damage System",
        description: "Incorporate damage channels, integrating support for Physical, Environmental, and Magical forms.",
        why_this_exists: "Allows different weapons, tools, and hazards to deal appropriate contextual damage types.",
        steps: [
          "Implement incoming damage validation logic inside components.",
          "Establish custom damage tags (Physical, Environmental, Magical).",
          "Pass damage types along standard actor damage channels."
        ],
        subtasks: [
          { id: "sub_6_2_1", title: "Setup custom damage type assets in workspace", completed: false, estimated_effort: "45m", tags: ["Assets"] },
          { id: "sub_6_2_2", title: "Pipe damage types into ApplyDamage formulas", completed: false, estimated_effort: "45m", tags: ["Math"] }
        ],
        notes: "",
        examples: ["Water hazard deals Environmental damage. Fire swords deal Magical damage."],
        dependencies: ["task_6_1"],
        blocked_by: ["task_6_1"],
        common_mistakes: ["Using simple raw floats with no category tags, making items immune to pickaxes or fire blocks."],
        suggestions: ["Utilize GamePlayTags to differentiate weapon hits from hazard damage cleanly."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Weapons apply damage to nodes, and multipliers operate as data instructs."],
        ai_help_prompts: ["How do I setup custom DamageTypes and parse them inside TakeDamage events?"]
      },
      {
        id: "task_6_3",
        title: "Death & Destruction Logic",
        description: "Coordinate death transitions: destroy or switch actor state and spawn animations, mesh swaps, or ragdolls.",
        why_this_exists: "Frees system memory on dynamic items while updating the visual geometry correctly.",
        steps: [
          "Bake death handling loops inside Base World Actor classes.",
          "Differentiate behaviors between NPCs (ragdoll) and rocks/trees (break geometry).",
          "Trigger mesh swaps or fracture simulations dynamically."
        ],
        subtasks: [
          { id: "sub_6_3_1", title: "Trigger alternate death tracks based on actor class", completed: false, estimated_effort: "60m", tags: ["Behavior"] },
          { id: "sub_6_3_2", title: "Integrate particle visual cascades on mesh destruction", completed: false, estimated_effort: "60m", tags: ["Visuals"] }
        ],
        notes: "",
        examples: ["Rock fractures into physical rubbles. Enemy NPC transitions to skeletal ragdoll physics."],
        dependencies: ["task_6_2"],
        blocked_by: ["task_6_2"],
        common_mistakes: ["Using immediate actor removal which chops off particle explosions or death animations instantly."],
        suggestions: ["Delay direct actor destruction for 5 seconds to allow effects and sounds to complete."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Actors transition smoothly, and dynamic meshes swap on zero health correctly."],
        ai_help_prompts: ["How can I replace a standard StaticMesh with breakable chunks on actor death?"]
      },
      {
        id: "task_6_4",
        title: "Loot Trigger System",
        description: "Connect death event handlers directly to LootTable assets, spawning resources at coordinates.",
        why_this_exists: "Guarantees resource rewards are spawned reliably at accurate locations upon harvesting or dispatching enemies.",
        steps: [
          "Create loot table schemas linked from DataAssets.",
          "Identify death location coordinate lists.",
          "Iterate loot lists and instantiate item pickles."
        ],
        subtasks: [
          { id: "sub_6_4_1", title: "Integrate loot triggers in base death sweeps", completed: false, estimated_effort: "45m", tags: ["Loot Spawner"] },
          { id: "sub_6_4_2", title: "Link loot rolls to random loot-table tables", completed: false, estimated_effort: "45m", tags: ["Math Calculations"] }
        ],
        notes: "",
        examples: ["Chest or MineNode triggers loot roll, spawning 3 Iron Ores at hit locations."],
        dependencies: ["task_6_3"],
        blocked_by: ["task_6_3"],
        common_mistakes: ["Hardcoding item spawn loops instead of reading variables inside LootDataAssets."],
        suggestions: ["Add a slight random velocity spread to spawned items so they scatter naturally."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Items spawn at exact death locations, and counts respect DataAsset values."],
        ai_help_prompts: ["Write a dynamic loot roll spawner that reads structures from DataAssets."]
      }
    ]
  },
  {
    id: 7,
    number: 7,
    title: "AI Foundation System",
    description: "Create a modular, data-driven AI system restricted entirely to NPC-type actors.",
    goal: "Stable pathfinding, state machines, and faction relationships for non-playable actors.",
    why_it_matters: "AI brings the game world to life, handling combat states, wildlife wanderings, and city citizen routines without running performance-heavy sensors on static items.",
    dependencies: ["Phase 2 (World Actor Base)", "Phase 6 (Health system)"],
    blocked_by: ["2", "6"],
    milestones: [
      "AI Controller base",
      "Perception system",
      "State system (StateTree or equivalent)",
      "Behavior templates",
      "Faction system",
      "Movement behaviors"
    ],
    examples: [
      "Deer: Wanders around peacefully, flees when player character approaches.",
      "Guard: Patrols gates, attacks faction enemies on sight."
    ],
    suggestions: [
      "Limit AI tickers strictly so actors sleep when player avatars are far away.",
      "Build relationships dynamically rather than checking raw actor names or strings."
    ],
    common_mistakes: [
      "Attaching AI components to static harvest nodes, wasting server speed.",
      "Mixing animation updates into AI controller graphs, locking threads."
    ],
    architecture_notes: [
      "AI components exist separately in UAISensingComponents. Factions are tagged utilizing GameplayTags."
    ],
    validation_checklist: [
      "NPCs react immediately to player visual footprints.",
      "State engines transition between Patrol, Alert, Chase, and Combat.",
      "Non-NPC static items are entirely clean of AI logic overheads."
    ],
    ai_prompts: [
      "Suggest modern structures for data-driven StateTree systems in Unreal RPGs."
    ],
    estimated_time: "14h",
    difficulty: "Hard",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_7_1",
        title: "AI Controller Base Setup",
        description: "Create BAIController_Base and assign exclusively as target controller profiles for NPCActors.",
        why_this_exists: "Centralizes coordinate routing, navigation, and decision graphs away from visuals.",
        steps: [
          "Create custom AIController class in designated directory folder.",
          "Inject navigation mesh support references.",
          "Assure player models bypass AI assignment triggers."
        ],
        subtasks: [
          { id: "sub_7_1_1", title: "Create BAIController_Base blueprint config", completed: false, estimated_effort: "45m", tags: ["Assets", "Core"] },
          { id: "sub_7_1_2", title: "Configure default nav parameters and pawn controls", completed: false, estimated_effort: "30m", tags: ["NavMesh"] }
        ],
        notes: "",
        examples: ["BAIController_Base takes possession of Guard NPC and sets up nav target updates."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Writing pathfinding or controller math inside character blueprints."],
        suggestions: ["Use PawnSensing or AIPerception in components to capture surroundings cleanly."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Controllers possess NPCs on spawn and initialize nav coordinates seamlessly."],
        ai_help_prompts: ["How do I instantiate and bind custom AIControllers inside C++ NPC models?"]
      },
      {
        id: "task_7_2",
        title: "Sensing Perception System",
        description: "Incorporate AIPerception components supporting Sight and noise indicators.",
        why_this_exists: "Allows NPCs to acquire players or targets dynamically based on environmental exposure.",
        steps: [
          "Add AIPerception component inside controllers.",
          "Configure sight range limits (cone angle = 90 degrees, radius = 1550cm).",
          "Hook OnPerceptionUpdated events to actor target caches."
        ],
        subtasks: [
          { id: "sub_7_2_1", title: "Add sight sensors config to character perception components", completed: false, estimated_effort: "60m", tags: ["Perception"] },
          { id: "sub_7_2_2", title: "Integrate target classification checks of visible tokens", completed: false, estimated_effort: "30m", tags: ["Acquisition"] }
        ],
        notes: "",
        examples: ["Entering guard's sight radius raises Alert value, setting the player avatar as TargetActor."],
        dependencies: ["task_7_1"],
        blocked_by: ["task_7_1"],
        common_mistakes: ["Using constant vector distance queries instead of Unreal's sight sweep components."],
        suggestions: ["Limit updates to 5 times per second instead of every frame to boost rates."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["NPC visually prints alert symbols upon player coordinates crossing sight vectors."],
        ai_help_prompts: ["Show me how to setup sight parameters inside an Unreal AIPerception component."]
      },
      {
        id: "task_7_3",
        title: "Behavior State Engine",
        description: "Implement a clean State Machine managing Idle, Patrol, Chase, and Combat states.",
        why_this_exists: "Controls NPC actions safely without looping conflicting commands or code blocks.",
        steps: [
          "Establish AI State Enum (Idle, Patrol, Chase, Combat).",
          "Program transition logic when perception variables update.",
          "Write state-specific movements (e.g., patrolling between spline points)."
        ],
        subtasks: [
          { id: "sub_7_3_1", title: "Declare AI state machine transition matrices", completed: false, estimated_effort: "60m", tags: ["State-Tree"] },
          { id: "sub_7_3_2", title: "Write patrolling path movements inside NPC graphs", completed: false, estimated_effort: "60m", tags: ["Movement Mapping"] }
        ],
        notes: "",
        examples: ["Losing sight of targets causes guards to drop Combat, changing to Patrol state after 3 seconds."],
        dependencies: ["task_7_2"],
        blocked_by: ["task_7_2"],
        common_mistakes: ["Nesting conditions inside complex tick branches, leading to frozen AI models."],
        suggestions: ["Use behavior trees or StateTrees for clean visual mappings of AI branches."],
        estimated_time: "4h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["NPC shifts states accurately and walks patrol splines continuously when idle."],
        ai_help_prompts: ["How do I construct a simple, modular state machine for enemy wandering?"]
      },
      {
        id: "task_7_4",
        title: "Faction system configuration",
        description: "Configure faction data structures (Player, Civilian, Enemy, Wildlife) and relation tables.",
        why_this_exists: "Organizes alliances and aggression matrices efficiently, preventing inter-system code splits.",
        steps: [
          "Bake faction tags (e.g., Faction.Enemy, Faction.Wildlife).",
          "Declare relationship states (Friendly, Neutral, Hostile).",
          "Verify target faction alignment before triggering combat sweeps."
        ],
        subtasks: [
          { id: "sub_7_4_1", title: "Build relation maps inside project data libraries", completed: false, estimated_effort: "45m", tags: ["Data tables"] },
          { id: "sub_7_4_2", title: "Connect alignment checks inside perception selectors", completed: false, estimated_effort: "45m", tags: ["Filters"] }
        ],
        notes: "",
        examples: ["Wolves are hostile to Players and civilians, but ignore other wolves."],
        dependencies: ["task_7_3"],
        blocked_by: ["task_7_3"],
        common_mistakes: ["Hardcoding name matches like 'BP_EnemyChar' which prevents friendly NPCs from being targeted by mistake."],
        suggestions: ["Register faction data arrays inside project-wide GameInstance assets to preserve access."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Hostility calculations evaluate correct values and only trigger chase vectors on foes."],
        ai_help_prompts: ["Design an elegant faction query matrix utilizing Unreal gameplay tags."]
      }
    ]
  },
  {
    id: 8,
    number: 8,
    title: "Save System (Local Only)",
    description: "Persist entire world state (actor transforms, variable states, health, destroyed items, player settings) locally.",
    goal: "Stable, non-volatile serialization structure that restores the map exactly on reload.",
    why_it_matters: "Nothing ruins immersion like objects respawning after harvesting. State persistence is the marker of complete world progression.",
    dependencies: ["Phase 3 (Unique IDs)", "Phase 6 (Health system)"],
    blocked_by: ["3", "6"],
    milestones: [
      "Save data structure",
      "Actor state serialization",
      "World save/load system",
      "Player state save",
      "Persistence validation"
    ],
    examples: [
      "Harvested rock: Remains gone after loading save.",
      "Player health: Persisted and restored correctly across sessions."
    ],
    suggestions: [
      "Rely exclusively on UniqueInstanceID fields to route saved tables back to positioned actors.",
      "Verify states are fully serialized to local dictionary storage before unloading coordinates."
    ],
    common_mistakes: [
      "Saving pointer locations instead of serialized structures, corrupting load profiles.",
      "Hardcoding level coordinates instead of building maps dynamically."
    ],
    architecture_notes: [
      "Unreal USaveGame files serialize into binary headers. Save managers route data asynchronously to prevent hitching."
    ],
    validation_checklist: [
      "Baking files saves level records safely on local directories.",
      "Loading state tables restores HP, positions, and inventory perfectly."
    ],
    ai_prompts: [
      "Explain best practice methods for dynamic actor state serialization in UE5."
    ],
    estimated_time: "10h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_8_1",
        title: "Save State Data structures",
        description: "Define USaveGame structure containing ActorID, Transform, current health, and state parameters.",
        why_this_exists: "Gives binary serializations a strict, typed structure to bundle properties.",
        steps: [
          "Create custom USaveGame class structures.",
          "Declare Struct fields tracking core player variables.",
          "Expose SaveGame flag tags on variables."
        ],
        subtasks: [
          { id: "sub_8_1_1", title: "Instantiate USaveGame blueprint templates", completed: false, estimated_effort: "45m", tags: ["Assets", "Core"] },
          { id: "sub_8_1_2", title: "Map variable tables into serialized structs", completed: false, estimated_effort: "45m", tags: ["Serialization"] }
        ],
        notes: "",
        examples: ["Struct: { 'ActorID': 'Rock_B_23', 'Health': 0.0, 'Transform': [100.0, 50.0, 0.0], 'IsDestroyed': true }."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Forgetting to update struct fields when modifying character metrics, causing load mismatches."],
        suggestions: ["Use nested arrays inside structures to easily capture complex inventory lists."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Structures compile correctly and serialize cleanly into debug string printouts."],
        ai_help_prompts: ["How do I construct a reusable serialization struct inside Unreal Editor?"]
      },
      {
        id: "task_8_2",
        title: "Actor State Serialization",
        description: "Program base actors to dump active variables into struct buffers before unloading maps.",
        why_this_exists: "Enables individual objects to represent their active metrics inside central files.",
        steps: [
          "Write state query protocols on BP_WorldActor_Base.",
          "Serialize position offsets and active HP metrics.",
          "Identify and mark items that stand fully destroyed."
        ],
        subtasks: [
          { id: "sub_8_2_1", title: "Build variable serialization loops inside target classes", completed: false, estimated_effort: "45m", tags: ["Query Logic"] },
          { id: "sub_8_2_2", title: "Setup destroyed state tracking tables", completed: false, estimated_effort: "45m", tags: ["Tracking"] }
        ],
        notes: "",
        examples: ["Destroyed iron veins save active state = destroyed, preventing them from spawning on future level boot procedures."],
        dependencies: ["task_8_1"],
        blocked_by: ["task_8_1"],
        common_mistakes: ["Trying to write files from individual actors in parallel, causing thread locks."],
        suggestions: ["Direct actors to register values in a central dictionary before writing disk files."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Actor values map accurately to centralized lists and capture destroyed properties."],
        ai_help_prompts: ["How do I query actor properties dynamically to serialize them on disk?"]
      },
      {
        id: "task_8_3",
        title: "Save/Load Manager System",
        description: "Construct central SaveGame managers that sweep maps, collect data, and serialize files.",
        why_this_exists: "Unifies data operations in a single class, avoiding duplicated disk activities.",
        steps: [
          "Instantiate BP_SaveGameManager inside world systems.",
          "Program SaveWorld and LoadWorld execution blocks.",
          "Restore coordinates and parameters inside placed actors."
        ],
        subtasks: [
          { id: "sub_8_3_1", title: "Write actor loop sweep systems in manager files", completed: false, estimated_effort: "60m", tags: ["Sweep Logic"] },
          { id: "sub_8_3_2", title: "Coordinate loading routines to align positions cleanly", completed: false, estimated_effort: "60m", tags: ["Restorer Interface"] }
        ],
        notes: "",
        examples: ["Pressing F5 sweeps level actors, packaging assets and saving to Slot1 on disk."],
        dependencies: ["task_8_2"],
        blocked_by: ["task_8_2"],
        common_mistakes: ["Spawning duplicated actors on reload instead of overriding positioned coordinates."],
        suggestions: ["Destroy default placed items on level boot if save logs mark them as harvested."],
        estimated_time: "4h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["Reloading levels leaves trees chopped, items collected, and actors positioned exactly."],
        ai_help_prompts: ["Write a save file editor manager that structures data loops in C++."]
      }
    ]
  },
  {
    id: 9,
    number: 9,
    title: "Inventory System",
    description: "Create standard item storage containers, slot math, stack managers, and pickup interaction triggers.",
    goal: "Stable item management system used across gathering, crafting, and trade routines.",
    why_it_matters: "RPGs rotate entirely around loot collection. Modular inventory structures ensure clean slot transfers, weights, and counts.",
    dependencies: ["Phase 4 (Interaction)", "Phase 8 (Save system foundation recommended)"],
    blocked_by: ["4", "8"],
    milestones: [
      "Item definition system",
      "Inventory container system",
      "Add/remove items",
      "Stack system",
      "Equipment hooks (future-ready)"
    ],
    examples: [
      "Adding 5 Iron Ores to full container fills raw stack slots, overflow spins off to vacant slots.",
      "Dragging elements updates slots."
    ],
    suggestions: [
      "Store inventory lists purely as structural records rather than attaching live actors.",
      "Check slot maximum limits before completing additions."
    ],
    common_mistakes: [
      "Spawning complete game actors in memory for items inside inventory drawers, blowing up memory.",
      "Allowing item count values to fall below zero on quick splits."
    ],
    architecture_notes: [
      "UInventoryComponent handles item lists, updating local client interfaces on modifications."
    ],
    validation_checklist: [
      "Picking up items puts them cleanly in available inventory blocks.",
      "Items stack correctly and respect maximum limit rules.",
      "Container records save on level exit vectors nicely."
    ],
    ai_prompts: [
      "How can I build an array-based slot database inside an actor component?"
    ],
    estimated_time: "12h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_9_1",
        title: "Data-Driven Item Definition",
        description: "Create PDA_ItemDataAsset DataAsset containing item name, type, icon description, stack size, and purchase values.",
        why_this_exists: "Unifies different items under a single data definition file, aiding modifications.",
        steps: [
          "Define PDA_ItemDataAsset structures.",
          "Incorporate ItemCategory Enum tags (Resource, Weapon, Consumable).",
          "Assemble assets for default items (IronOre, OakLog, Herb)."
        ],
        subtasks: [
          { id: "sub_9_1_1", title: "Create PDA_ItemDataAsset base class structures", completed: false, estimated_effort: "45m", tags: ["DataAsset", "Template"] },
          { id: "sub_9_1_2", title: "Instantiate default item configs in directories", completed: false, estimated_effort: "30m", tags: ["Assets Configuration"] }
        ],
        notes: "",
        examples: ["ItemDataAsset OakLog: Name = Oak Log, MaxStack = 20, Value = 5, Category = Resource."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Putting visual mesh details or hit logic inside inventory item datasets."],
        suggestions: ["Keep properties simple; link equipment meshes inside separate gear tables."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Item assets compile correctly and details parse nicely inside text boxes."],
        ai_help_prompts: ["How do I manage icons and properties in a C++ ItemDataAsset?"]
      },
      {
        id: "task_9_2",
        title: "Inventory Component Container",
        description: "Program UInventoryComponent managing arrays of ItemStructures, slots validation, and additions.",
        why_this_exists: "Centralizes container space math, preventing duplication hacks on player models.",
        steps: [
          "Create UInventoryComponent class files.",
          "Write structural matrices identifying Slots (SlotIndex, ItemDA, Count).",
          "Program AddItem, RemoveItem, and SplitStack parameters."
        ],
        subtasks: [
          { id: "sub_9_2_1", title: "Build UInventoryComponent data layouts in code", completed: false, estimated_effort: "60m", tags: ["Component", "C++ Logic"] },
          { id: "sub_9_2_2", title: "Write stack split verification algorithms", completed: false, estimated_effort: "60m", tags: ["Math Calculations"] }
        ],
        notes: "",
        examples: ["Adding 5 units of Stone splits into current partial stone stack, updating the total securely."],
        dependencies: ["task_9_1"],
        blocked_by: ["task_9_1"],
        common_mistakes: ["Using simple integer lists which prevents items from holding custom data (e.g., weapon durabilities)."],
        suggestions: ["Declare structures containing ItemData references alongside dynamic parameter sets."],
        estimated_time: "4.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Container variables update properly, and stack counts strictly respect limits."],
        ai_help_prompts: ["How do I design a safe array-based inventory container in Unreal?"]
      },
      {
        id: "task_9_3",
        title: "Interactable Pickup Spawner",
        description: "Assemble BP_ItemPickup actors that represent physical items in-game, loading mesh assets dynamically from DAs.",
        why_this_exists: "Facilitates seamless visual representations of items sitting in worlds waiting for exploration.",
        steps: [
          "Create BP_ItemPickup inheriting from Base World Actors.",
          "Implement BPI_Interactable interface methods.",
          "On interact: add item to player component, then destroy the pickup handle."
        ],
        subtasks: [
          { id: "sub_9_3_1", title: "Instantiate pickup class and attach collisions", completed: false, estimated_effort: "30m", tags: ["Visual Asset"] },
          { id: "sub_9_3_2", title: "Write pickup collection triggers inside BPI methods", completed: false, estimated_effort: "45m", tags: ["Interface Method"] }
        ],
        notes: "",
        examples: ["Walking to log and pressing E adds 'OakLog' to player inventory, vanishing the physical log model."],
        dependencies: ["task_9_2"],
        blocked_by: ["task_9_2"],
        common_mistakes: ["Attaching inventory components directly to individual pickup actors, wasting memory."],
        suggestions: ["Just drop a simple Struct item payload onto the spawner during world generation."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Collection vanishes items cleanly, and counts update accurately inside inventories."],
        ai_help_prompts: ["How do I pass an item struct from an interactable pickup to Player inventory?"]
      }
    ]
  },
  {
    id: 10,
    number: 10,
    title: "Gathering / Harvesting System",
    description: "Connect interaction loops, weapon hits, and generic health values to deplete resources (rocks, trees) and spawn items.",
    goal: "Core gameplay system supporting resource collection, world depletions, and dynamic visual state changes.",
    why_it_matters: "A survival/economy loop starts with basic harvesting. Unifying this under Phase 6 health logic ensures standard depletions across resources.",
    dependencies: ["Phase 6 (Health system)", "Phase 9 (Inventory)", "Phase 4 (Interaction)"],
    blocked_by: ["6", "9", "4"],
    milestones: [
      "Resource actors (trees, rocks)",
      "Harvest interaction",
      "Resource depletion",
      "Loot output system"
    ],
    examples: [
      "Hitting an OakTree with an Axe deals 20 damage, spawns wood chips, and awards 1 Oak Log.",
      "Dead trees fall down and become stumps."
    ],
    suggestions: [
      "Verify ToolRequired tags inside resources match active weapons before dealing damage.",
      "Differentiate damage triggers based on tools used (e.g. pickaxe vs stone)."
    ],
    common_mistakes: [
      "Creating isolated copper, iron, wood classes instead of utilizing PDA parameters inside world bases.",
      "Forgetting to update world collision boxes when items break, leading to invisible blocks."
    ],
    architecture_notes: [
      "Resources are Base World Actors carrying UHealthComponent and referencing PDAs for loot drops."
    ],
    validation_checklist: [
      "Hitting resources reduces HP and displays custom hit FX cues.",
      "Reaching 0 HP triggers fracture transitions and drops items.",
      "Gathered items appear immediately in dynamic player slots."
    ],
    ai_prompts: [
      "Show me dynamic blueprint pipelines for resource depletion and stump swaps."
    ],
    estimated_time: "10h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_10_1",
        title: "Flexible Resource Actor setup",
        description: "Configure BP_ResourceNode representing different nodes (Gold/Iron/Oaks) configured entirely via DA references.",
        why_this_exists: "Unifies environment models under one class, simplifying bulk updates.",
        steps: [
          "Create BP_ResourceNode asset in world directories.",
          "Incorporate visual components (DestructibleMesh or mesh refs).",
          "Append Health, interactions, and unique ID details."
        ],
        subtasks: [
          { id: "sub_10_1_1", title: "Build universal BP_ResourceNode layout", completed: false, estimated_effort: "45m", tags: ["Assets Configuration"] },
          { id: "sub_10_1_2", title: "Map mesh sockets inside constructor scripts", completed: false, estimated_effort: "30m", tags: ["Construction Script"] }
        ],
        notes: "",
        examples: ["Setting DA to IronNode adjusts mesh to rock formations, and updates requirements to Pickaxe."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Hardcoding static values inside separate Copper blueprint files."],
        suggestions: ["Use data inheritance to set up varying resource levels smoothly."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Node mesh adjusts immediately upon assigning alternate DataAssets in editor."],
        ai_help_prompts: ["How do I instantiate data-driven interactive environmental objects in Unreal?"]
      },
      {
        id: "task_10_2",
        title: "Harvesting Interaction pipeline",
        description: "Integrate harvesting loops that execute on weapon impacts to apply damage to resource health pools.",
        why_this_exists: "Ensures that harvesting functions like combat, reducing the need for duplicate impact systems.",
        steps: [
          "Link BPI_Interactable to trigger tool evaluations.",
          "Expose tool requirements (ToolCategory = Pickaxe, Tier = 1).",
          "Apply Damage to nodes on validation checks."
        ],
        subtasks: [
          { id: "sub_10_2_1", title: "Draft weapon/tool restriction validation algorithms", completed: false, estimated_effort: "45m", tags: ["Validators"] },
          { id: "sub_10_2_2", title: "Write health reduction calls inside tool impact graphs", completed: false, estimated_effort: "45m", tags: ["Impact Logic"] }
        ],
        notes: "",
        examples: ["Using swords on Ores alerts: 'Requires Pickaxe'. Hitting with Pickaxe works cleanly, deducting 25 HP."],
        dependencies: ["task_10_1"],
        blocked_by: ["task_10_1"],
        common_mistakes: ["Running damage checks on models without confirming if target tags match weapon classes."],
        suggestions: ["Play satisfying, high-frequency clinking sound effects on valid hits to bolster impact feel."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Hitting resources reduces HP only if the correct tool category is equipped."],
        ai_help_prompts: ["How do I check equipped items tags within interaction events before damaging Ores?"]
      },
      {
        id: "task_10_3",
        title: "Resource Depletion & Respawn",
        description: "Upon reaching 0 HP, switch meshes to stump/fractured versions, spawn look loot, and start refresh timers.",
        why_this_exists: "Ensures the landscape visually reflects collection progress while supporting respawn cycles over time.",
        steps: [
          "Trigger mesh switches inside OnDeath event connections.",
          "Disable active interaction scopes to prevent continuous hit routines.",
          "Inject coordinate refresh systems to restore node volumes after set delay."
        ],
        subtasks: [
          { id: "sub_10_3_1", title: "Program visual stump swaps in resource nodes", completed: false, estimated_effort: "45m", tags: ["Visual Swap"] },
          { id: "sub_10_3_2", title: "Construct respawn timer loops using world state controllers", completed: false, estimated_effort: "45m", tags: ["Regeneration"] }
        ],
        notes: "",
        examples: ["Tree changes into stump on destruction, dropping 3 raw logs, then respawns after 180 seconds."],
        dependencies: ["task_10_2"],
        blocked_by: ["task_10_2"],
        common_mistakes: ["Spawning complete duplicates on top of old assets, causing collision overlapping bugs."],
        suggestions: ["Hide broken meshes smoothly using opacity fades before resetting default variables."],
        estimated_time: "4h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Broken nodes block interactions, drop loot, and respawn precisely after configured delays."],
        ai_help_prompts: ["Write a blueprint timers loop that clean and respawns environmental objects."]
      }
    ]
  },
  {
    id: 11,
    number: 11,
    title: "Combat System",
    description: "Design attack systems, melee collision tracers, hit detection validators, and AI combat states integration.",
    goal: "Melee combat loops with precise hit detections and visual stagger feedbacks.",
    why_it_matters: "Action gameplay depends on high-responsiveness and tight hit feedback. Robust tracing avoids sloppy physics overlaps.",
    dependencies: ["Phase 6 (Health)", "Phase 7 (AI)", "Phase 9 (Inventory optional)", "Phase 1 (Character movement)"],
    blocked_by: ["6", "7", "9", "1"],
    milestones: [
      "Melee system",
      "Hit detection",
      "Damage application",
      "Enemy reaction",
      "Combat feedback system"
    ],
    examples: [
      "Swinging sword runs complex physical trace sweeps across the blades.",
      "Successful hits apply damage, flash damage overlays, and alert AI searchers."
    ],
    suggestions: [
      "Utilize Socket Traces during animation frames to ensure high-fidelity sword-to-flesh collisions.",
      "Switch target AI states immediately to Hostile when hit registers."
    ],
    common_mistakes: [
      "Using flat collision capsules that register hits when targets stand behind weapon arcs.",
      "Attaching damage triggers blindly to general animation events with no coordinate sweeps."
    ],
    architecture_notes: [
      "Combat state manages anim speeds. Complex tracing operates inside UMeleeControllerComponent."
    ],
    validation_checklist: [
      "Swinging weapons triggers sweep traces cleanly.",
      "Hitting hostiles subtracts accurate values from targets.",
      "Damaged NPCs pivot immediately to confront attackers."
    ],
    ai_prompts: [
      "Explain animation-based socket sweep traces for melee configurations."
    ],
    estimated_time: "14h",
    difficulty: "Hard",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_11_1",
        title: "Melee Collision Socket tracer",
        description: "Run sword trace checks between anim sockets 'Base' and 'Tip' on active frames.",
        why_this_exists: "Guarantees combat hits align perfectly with physical weapon speeds and swing movements.",
        steps: [
          "Establish weapon skeletal sockets (Socket_Base, Socket_Tip).",
          "Program multi-sphere line sweeps between sockets inside AnimNotifyState blocks.",
          "Prevent duplicated hits on the same enemy during a single swing."
        ],
        subtasks: [
          { id: "sub_11_1_1", title: "Create custom Combat AnimNotify classes", completed: false, estimated_effort: "60m", tags: ["Animation Notices"] },
          { id: "sub_11_1_2", title: "Build multi-sphere socket tracing systems", completed: false, estimated_effort: "60m", tags: ["Physics Sweeps"] }
        ],
        notes: "",
        examples: ["Tracing launches on frame 10 and stops on frame 24, checking coordinate contacts along weapon arcs."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using simple front-facing distance checks that ignore real weapon swing dimensions."],
        suggestions: ["Cache hit actors array to guarantee and clamp hit updates to a single register per swing event."],
        estimated_time: "4h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["Line sweeps register hits, printing targets to diagnostic outputs cleanly."],
        ai_help_prompts: ["How do I configure and run line traces between weapon sockets in C++?"]
      },
      {
        id: "task_11_2",
        title: "Damage application validators",
        description: "Validate combat hits and send damage to targets, passing armor, resistances, and tags along channels.",
        why_this_exists: "Unifies hit registers under standard networks, avoiding bypasses on state systems.",
        steps: [
          "Verify target carries active Health components.",
          "Calculate final values (Raw Damage * faction multipliers).",
          "Apply Damage utilizing standard TakeDamage function structures."
        ],
        subtasks: [
          { id: "sub_11_2_1", title: "Build combat damage calculations formulas", completed: false, estimated_effort: "45m", tags: ["Calculations"] },
          { id: "sub_11_2_2", title: "Send data across target health pipeline layers", completed: false, estimated_effort: "45m", tags: ["Execution"] }
        ],
        notes: "",
        examples: ["Sword hits Skeleton. Structural checks evaluate Skeleton is hostile faction, applying 20 physical damage."],
        dependencies: ["task_11_1"],
        blocked_by: ["task_11_1"],
        common_mistakes: ["Bypassing interface channels to subtract health values directly, skipping state metrics."],
        suggestions: ["Structure calculations cleanly inside damage data libraries to help scaling updates."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Combat hits trigger standard takeaway functions and modify health lists."],
         ai_help_prompts: ["What is the best way to handle complex damage formulas securely in multiplayer?"]
      },
      {
        id: "task_11_3",
        title: "AI Agro reaction checks",
        description: "Upon receiving damage, shift AI state dynamically to Combat, caching attackers as current TargetActor.",
        why_this_exists: "Prevents hostiles from ignoring hits, directing combat groups immediately to engage.",
        steps: [
          "Bind damage reactions inside AI event loops.",
          "Alert nearby allies of the attacker's coordinates.",
          "Clear patrol points and launch chase behavior logic."
        ],
        subtasks: [
          { id: "sub_11_3_1", title: "Setup combat state modifiers inside AI StateTrees", completed: false, estimated_effort: "45m", tags: ["AI Behavior"] },
          { id: "sub_11_3_2", title: "Link dynamic alerting logic to surrounding group tags", completed: false, estimated_effort: "45m", tags: ["Social Perception"] }
        ],
        notes: "",
        examples: ["Hitting Guard triggers 'Faction.Hostile' relation updates, altering state immediately to Chase."],
        dependencies: ["task_11_2"],
        blocked_by: ["task_11_2"],
        common_mistakes: ["Letting NPCs take damage while remaining in peaceful wander behaviors indefinitely."],
        suggestions: ["Play aggressive warning barks or battle cries on hostility changes to build tension."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Damaging peaceful enemies immediately pivots their coordinates to chase players."],
        ai_help_prompts: ["How do I alert surrounding AI controllers of players location upon taking hits?"]
      },
      {
        id: "task_11_4",
        title: "Dynamic hit reaction feedbacks",
        description: "Trigger hit screen shakes, play sound barks, spawn blood splats, and implement brief visual hitches.",
        why_this_exists: "Ensures every hit has mechanical weight and impact clarity.",
        steps: [
          "Play staggered animation sequences on hits.",
          "Trigger client-side camera jolts on sword contacts.",
          "Instantiate hit freeze-frames (0.05s time-dilation overrides)."
        ],
        subtasks: [
          { id: "sub_11_4_1", title: "Incorporate staggered hit react tables inside animation templates", completed: false, estimated_effort: "45m", tags: ["Anim Montage"] },
          { id: "sub_11_4_2", title: "Build screen shake effects inside player controller classes", completed: false, estimated_effort: "45m", tags: ["Camera UI"] }
        ],
        notes: "",
        examples: ["Registering hit stalls weapon execution briefly and shakes player cameras slightly."],
        dependencies: ["task_11_2"],
        blocked_by: ["task_11_2"],
        common_mistakes: ["Omitting feedback systems, making melee combat look flat and feel unresponsive."],
        suggestions: ["Vary stagger behaviors based on attack levels (heavy hits trigger knockdowns)."],
        estimated_time: "3h",
        difficulty: "Easy",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Visual shakes and stagger animation montages execute cleanly during combat instances."],
        ai_help_prompts: ["How do I implement satisfying physical time dilations on combat contacts?"]
      }
    ]
  },
  {
    id: 12,
    number: 12,
    title: "Crafting System",
    description: "Design recipe data structures, dynamic combination checkers, item consumptions, and UI recipe panels.",
    goal: "Recipe data models that validate inventory records to produce crafted items cleanly.",
    why_it_matters: "Crafting connects gathering exploration and inventory slots. Centralized checks secure recipe resolutions without item duplication loops.",
    dependencies: ["Phase 9 (Inventory)", "Phase 10 (Gathering)"],
    blocked_by: ["9", "10"],
    milestones: [
      "Recipe system",
      "Crafting UI logic",
      "Item combination rules",
      "Result generation system"
    ],
    examples: [
      "Crafting Wood Axe requires 2 Wood and 1 Stone.",
      "Inventory removes wood and stone, updating slots with Wood Axe dynamically."
    ],
    suggestions: [
      "Implement double-validation on inventory spaces before stripping inputs, avoiding slot drops.",
      "Check item requirements strictly inside non-ui class controllers to guarantee stability."
    ],
    common_mistakes: [
      "Running recipe logic in UI components directly, making crafting susceptible to timing glitches."
    ],
    architecture_notes: [
      "PDA_CraftingRecipe represents combination parameters."
    ],
    validation_checklist: [
      "System details required and missing items clearly for recipes.",
      "Crafting actions consume exact ingredient totals.",
      "Crafted items slide into open item slots cleanly."
    ],
    ai_prompts: [
      "How do I setup recipe registries that organize materials arrays efficiently?"
    ],
    estimated_time: "10h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_12_1",
        title: "Recipe asset schemas",
        description: "Construct PDA_CraftingRecipe DataAsset storing material requirements arrays and outputs.",
        why_this_exists: "Enables designers to balance combination ratios cleanly via separate data files.",
        steps: [
          "Establish PDA_CraftingRecipe fields.",
          "Assemble structural inputs (MaterialDA, RequiredCount).",
          "Specify output item variables and quantities."
        ],
        subtasks: [
          { id: "sub_12_1_1", title: "Create PDA_CraftingRecipe class structure templates", completed: false, estimated_effort: "45m", tags: ["DataAsset", "Config"] },
          { id: "sub_12_1_2", title: "Formulate default recipes inside content directories", completed: false, estimated_effort: "30m", tags: ["Assets Configuration"] }
        ],
        notes: "",
        examples: ["Recipe StonePickaxe: Ingredients = { 3 Stone, 2 Wood }, Output = StonePickaxe."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Putting visual workstation locations inside recipe asset parameters."],
        suggestions: ["Add minimum character skill tier parameters to recipe structures for future scaling."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Recipe files save correctly and compile with structured lists."],
        ai_help_prompts: ["How do I construct custom structures arrays inside Unreal C++?"]
      },
      {
        id: "task_12_2",
        title: "Crafting verification backend",
        description: "Develop validations verifying inventories hold materials, removing inputs and appending outputs.",
        why_this_exists: "Secures actual item updates, preventing exploit loops or resource duplication bugs.",
        steps: [
          "Write CheckIngredients queries inside inventory handlers.",
          "Perform double-check validation on outputs spaces before deducting inputs.",
          "Trigger concurrent inventory adjustments."
        ],
        subtasks: [
          { id: "sub_12_2_1", title: "Build recipe ingredients checker algorithms", completed: false, estimated_effort: "45m", tags: ["Verification"] },
          { id: "sub_12_2_2", title: "Write thread-safe inventory transaction pipelines", completed: false, estimated_effort: "45m", tags: ["Transactions"] }
        ],
        notes: "",
        examples: ["System confirms wood count >= 2, removes 2 Wood and adds 1 Torch to inventory."],
        dependencies: ["task_12_1"],
        blocked_by: ["task_12_1"],
        common_mistakes: ["Consuming wood before verifying target inventory has slots to accept the output, destroying materials."],
        suggestions: ["Generate unique transaction IDs for crafting updates to simplify telemetry logging."],
        estimated_time: "4h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Transactions fail gracefully on missing items, consuming zero ingredients."],
        ai_help_prompts: ["How can I execute safe item modifications within a C++ component?"]
      },
      {
        id: "task_12_3",
        title: "Crafting Menu UI connectors",
        description: "Design UI panels listing recipes, analyzing inventories to render green checks or red missing numbers.",
        why_this_exists: "Displays options, and updates resource requirements dynamically.",
        steps: [
          "Draft crafting panel UI containers.",
          "Generate dynamic lists mapping possible PDA_Recipes.",
          "Coordinate item updates to recheck materials on tab open."
        ],
        subtasks: [
          { id: "sub_12_3_1", title: "Build Crafting Menu overlay Widgets", completed: false, estimated_effort: "45m", tags: ["UI", "Widget"] },
          { id: "sub_12_3_2", title: "Setup inventory state listeners in UI cards", completed: false, estimated_effort: "45m", tags: ["Data Bindings"] }
        ],
        notes: "",
        examples: ["UI shows 'Rope (2/3 Yarn)' in red text, changing immediately to green when yarn is gathered."],
        dependencies: ["task_12_2"],
        blocked_by: ["task_12_2"],
        common_mistakes: ["Writing duplicate inventory trackers in UI controllers instead of querying core components."],
        suggestions: ["Establish clean event bindings to refresh menus only when player items change."],
        estimated_time: "3.5h",
        difficulty: "Easy",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Crafting lists match player items and update in real-time on material updates."],
        ai_help_prompts: ["How do I bind widget grids to updates of inventory arrays in Unreal?"]
      }
    ]
  },
  {
    id: 13,
    number: 13,
    title: "Quest System",
    description: "Create quest structures, dynamic objective trackers (kill, gather, explore), managers, and reward spawners.",
    goal: "Structured player-progression tracker that responds dynamically to world event markers.",
    why_it_matters: "Quests structure adventure paths. Decoupled objective listeners avoid constant checking loops, boosting server efficiency.",
    dependencies: ["Phase 4 (Interaction)", "Phase 8 (Save system)", "Phase 9 (Inventory)"],
    blocked_by: ["4", "8", "9"],
    milestones: [
      "Quest data structure",
      "Quest tracking system",
      "Objective system",
      "Completion detection",
      "Reward system"
    ],
    examples: [
      "Quest: 'Boar Hunt' contains objectives: Kill 3 Boars, Collect 2 Tusks.",
      "Gathering items or slaying boars updates objectives and awards 100 Gold."
    ],
    suggestions: [
      "Employ event-driven systems where quests evaluate objectives only when events are broadcast.",
      "Track active states utilizing serializable arrays for quick local saves."
    ],
    common_mistakes: [
      "Checking player coordinates or item arrays every frame inside massive Tick loops, tanking frame-rate."
    ],
    architecture_notes: [
      "UQuestManager triggers event brokers to track progression milestones."
    ],
    validation_checklist: [
      "Toggling quest files registers active trackers cleanly.",
      "Slush events progress objectives automatically as actions execute.",
      "Completing tasks deposits configured gear into player bags."
    ],
    ai_prompts: [
      "How do I setup dynamic quest frameworks using event dispatchers?"
    ],
    estimated_time: "12h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_13_1",
        title: "Quest asset data schemas",
        description: "Incorporate PDA_QuestDataAsset storing QuestID, description lists, objectives arrays, and rewards.",
        why_this_exists: "Enables fast narrative creations, completely decoupled from scripting controllers.",
        steps: [
          "Bake PDA_QuestDataAsset structure properties.",
          "Assemble objective Structs (ObjectiveType, TargetTag, RequiredAmount).",
          "Map reward variables (GoldCount, LootTableDA)."
        ],
        subtasks: [
          { id: "sub_13_1_1", title: "Create PDA_QuestDataAsset templates inside workspace", completed: false, estimated_effort: "45m", tags: ["DataAsset", "Template"] },
          { id: "sub_13_1_2", title: "Assemble default test quest packages in editor", completed: false, estimated_effort: "30m", tags: ["Configs Setup"] }
        ],
        notes: "",
        examples: ["Quest MinerChoice: Objectives = { Collect Iron 5 }, Reward = PickaxeUpgrade."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Putting hard execution scripts inside structural Quest details."],
        suggestions: ["Add unique identifiers to objectives to organize progress trackers cleanly."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Quest structures compile cleanly and parameters map correctly inside inspectors."],
        ai_help_prompts: ["How do I construct custom enumerators for quest objective structures in C++?"]
      },
      {
        id: "task_13_2",
        title: "Dynamic Event objective trackers",
        description: "Program objective trackers that listen for global game events (OnCombatKill, OnResourceGathered, OnNPCSpoken).",
        why_this_exists: "Removes constant checking loops, making state updates completely react-based.",
        steps: [
          "Establish global GameInstance quest broker channels.",
          "Program quest elements to bind to specific broker alerts on activation.",
          "Implement objective updates tracking current totals."
        ],
        subtasks: [
          { id: "sub_13_2_1", title: "Create global GameEvent broker systems", completed: false, estimated_effort: "60m", tags: ["Event Brokers"] },
          { id: "sub_13_2_2", title: "Build objective counters within active quest tracking models", completed: false, estimated_effort: "60m", tags: ["Objectives Logic"] }
        ],
        notes: "",
        examples: ["Slaying target triggers Broker OnCombatKill. Quest 'MineHunt' intercepts, raising SlayCount from 1 to 2."],
        dependencies: ["task_13_1"],
        blocked_by: ["task_13_1"],
        common_mistakes: ["Polling player inventory details on every frame tick to check item counts instead of observing events."],
        suggestions: ["Only evaluate quest states when registered event triggers fire."],
        estimated_time: "4.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Broadcasting event alerts increments progression variables securely."],
        ai_help_prompts: ["How do I implement a lightweight EventBroker framework inside Unreal?"]
      },
      {
        id: "task_13_3",
        title: "Central Quest Manager component",
        description: "Create UQuestManager managing active quests, updating progression lists, and distributing rewards.",
        why_this_exists: "Ensuring save files and HUD widgets interface with a clean single progression manager instance.",
        steps: [
          "Instantiate UQuestManager Component on character classes.",
          "Setup AcceptQuest, ProgressQuest, and AbandonQuest pathways.",
          "Deposit reward assets on complete markers."
        ],
        subtasks: [
          { id: "sub_13_3_1", title: "Instantiate UQuestManager components", completed: false, estimated_effort: "45m", tags: ["Component", "C++ System"] },
          { id: "sub_13_3_2", title: "Setup inventory handshakes on Quest complete variables", completed: false, estimated_effort: "45m", tags: ["Rewards Spawner"] }
        ],
        notes: "",
        examples: ["Completing 'MinerChoice' grants 200XP, invokes notification overlays, and puts rewards in bags."],
        dependencies: ["task_13_2"],
        blocked_by: ["task_13_2"],
        common_mistakes: ["Distributing rewards twice due to race conditions inside rapid UI click event loops."],
        suggestions: ["Perform all reward allocations on server-side authority nodes before updating local state."],
        estimated_time: "5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Quests complete cleanly, alerting managers and giving correct items once."],
        ai_help_prompts: ["Draft a secure reward-distribution checker function inside Unreal C++."]
      }
    ]
  },
  {
    id: 14,
    number: 14,
    title: "Dialogue System",
    description: "Design dialogue trees, NPC chat interfaces, choice systems, and quest connectors.",
    goal: "Universal dialogue system configured purely by assets to handle conversations dynamically.",
    why_it_matters: "NPC conversations drive stories and launch quests. Rigid script blocks block rapid dialogue iterations across development teams.",
    dependencies: ["Phase 7 (AI NPCs)", "Phase 4 (Interaction)"],
    blocked_by: ["7", "4"],
    milestones: [
      "Dialogue tree system",
      "NPC dialogue data",
      "Choice system",
      "Quest integration hook"
    ],
    examples: [
      "Interacting with Blacksmith opens dialogue card: 'Need help gathering iron?'",
      "Player clicks Yes: quest starts."
    ],
    suggestions: [
      "Store conversation nodes as simple arrays of structs referencing text, Speaker, and choices.",
      "Inject quest state validation checks before unlocking choices."
    ],
    common_mistakes: [
      "Spawning complex custom UI overlay structures per NPC actor class."
    ],
    architecture_notes: [
      "PDA_Dialogue represents dialogue configurations."
    ],
    validation_checklist: [
      "Conversations load correctly upon clicking target NPCs.",
      "Player prompts display options. Clicking choices routes dialogue properly.",
      "Dialogue events award quests or items correctly."
    ],
    ai_prompts: [
      "Recommend data asset schemas for modular branching dialogue in Unreal Engine."
    ],
    estimated_time: "8h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_14_1",
        title: "Branching Dialogue data schemas",
        description: "Create PDA_Dialogue containing dialogue texts, author tags, and player response branches.",
        why_this_exists: "Keeps conversation lines in isolated database files, removing text clutter from blueprints.",
        steps: [
          "Bake PDA_Dialogue data variables.",
          "Assemble structural nodes (TextID, SpeakerName, SpeechText, ChoicesCount).",
          "Map choice nodes to branch targets."
        ],
        subtasks: [
          { id: "sub_14_1_1", title: "Create PDA_Dialogue assets types inside content paths", completed: false, estimated_effort: "45m", tags: ["DataAsset"] },
          { id: "sub_14_1_2", title: "Design branching structures variables inside templates", completed: false, estimated_effort: "45m", tags: ["Branching Data"] }
        ],
        notes: "",
        examples: ["Dialogue Node1: 'Need armor?' Choices = { 'Buy' -> OpenShop, 'Later' -> Close }."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Writing nested string conditionals in blueprint graphs to branch conversations."],
        suggestions: ["Add unique identifiers to dialog nodes to make jumping between trees simple."],
        estimated_time: "2.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Dialogue trees compile cleanly and parameters map correctly inside parameters."],
        ai_help_prompts: ["How do I configure branching references inside an Unreal DataAsset?"]
      },
      {
        id: "task_14_2",
        title: "Dialogue UI system",
        description: "Assemble UI overlay controllers that display dialogue nodes and render clickable choices card queues.",
        why_this_exists: "Centralizes conversational interfaces, avoiding the need for individual NPC UI models.",
        steps: [
          "Draft dialogue menus overlays.",
          "Feed current texts inside active UI text blocks.",
          "Dynamically spawn response buttons for custom lists."
        ],
        subtasks: [
          { id: "sub_14_2_1", title: "Incorporate dynamic text layouts inside dialogue HUDs", completed: false, estimated_effort: "30m", tags: ["UI", "Widget"] },
          { id: "sub_14_2_2", title: "Build button generators mapping choice outputs", completed: false, estimated_effort: "45m", tags: ["Buttons System"] }
        ],
        notes: "",
        examples: ["Interacting with TownElder opens dialogue card, listing options 'Ask about valley', 'Goodbye'."],
        dependencies: ["task_14_1"],
        blocked_by: ["task_14_1"],
        common_mistakes: ["Using direct size definitions for buttons which blocks text expansion in localized languages."],
        suggestions: ["Use auto wrap and vertical size boxes on conversational grids."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Dialog UI populates texts and correctly wraps option buttons dynamically."],
        ai_help_prompts: ["What is the best way to handle dynamic button size boxes in Unreal UI?"]
      },
      {
        id: "task_14_3",
        title: "State Handshake links",
        description: "Unify conversation paths to triggers (AcceptQuest, UnlockTrade, DeductGold) and quest checks.",
        why_this_exists: "Ensures talking actually triggers progression updates, rather than just acting as plain narrative cards.",
        steps: [
          "Establish dialogue action tags.",
          "Trigger state calculations upon clicking responsive options.",
          "Inject conditions checking if players hold items before showing dialog blocks."
        ],
        subtasks: [
          { id: "sub_14_3_1", title: "Draft action trigger dispatchers in dialogue controls", completed: false, estimated_effort: "45m", tags: ["Action Dispatchers"] },
          { id: "sub_14_3_2", title: "Connect inventory conditions checks to dialog nodes", completed: false, estimated_effort: "45m", tags: ["State Handshakes"] }
        ],
        notes: "",
        examples: ["Clicking 'Accept' on Elder's dialogue starts 'MinerChoice' quest and shuts UI interfaces."],
        dependencies: ["task_14_2"],
        blocked_by: ["task_14_2"],
        common_mistakes: ["Letting people click quest option lines repeatedly, spawning duplicate quest trackers."],
        suggestions: ["Deactivate button states immediate on clicking to prevent double hits."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Dialogue actions transition states, start quests, and deduct gold correctly."],
        ai_help_prompts: ["How can I hook dialogue actions to quest manager accept events?"]
      }
    ]
  },
  {
    id: 15,
    number: 15,
    title: "World Systems (Dynamic World)",
    description: "Incorporate Day/Night cycle, weather fluctuations, light transitions, and faction expansions.",
    goal: "Central Day/Night and Weather manager that guides lighting and AI wanderings.",
    why_it_matters: "An immersive landscape shifts over time. Running dynamic lighting, day schedules, and weather shifts prevents flat worlds.",
    dependencies: ["Phase 2 (World actors)", "Phase 7 (AI)"],
    blocked_by: ["2", "7"],
    milestones: [
      "Day/night cycle",
      "Weather system",
      "Ambient world events",
      "Faction system expansion"
    ],
    examples: [
      "In-game hours pass: sun sets, and directional light outputs ease to moon hues.",
      "NPCs walk to taverns/houses to sleep during dark night cycles."
    ],
    suggestions: [
      "Use central world controllers to handle lighting changes, avoiding duplicate ticks on objects.",
      "Check in-game hour lists to determine active AI behaviors."
    ],
    common_mistakes: [
      "Spawning duplicate lighting actors in parallel grids, creating visual glitching and performance drops."
    ],
    architecture_notes: [
      "Dynamic weather systems adjust particle scales of fog and rain models inside BP_WorldSystemsManager."
    ],
    validation_checklist: [
      "Day/Night systems progress time and adjust directional angles correctly.",
      "Weather triggers spawn rain overlays and fog heights cleanly.",
      "NPC behaviors shift depending on active day/night indices."
    ],
    ai_prompts: [
      "How do I manage dynamic directional light rotations in Unreal Engine?"
    ],
    estimated_time: "8h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_15_1",
        title: "Dynamic Day/Night tracker",
        description: "Assemble central DayNight managers that rotate SkySphere models, adjust pitch angles, and change intensity variables.",
        why_this_exists: "Guides continuous environmental rotations, altering visual properties logically.",
        steps: [
          "Create BP_DayNightCycle world system actors.",
          "Program SkySphere light controllers referencing the active sun directional vector.",
          "Establish time variables (e.g., 1 minute real-time = 1 hour in-game)."
        ],
        subtasks: [
          { id: "sub_15_1_1", title: "Build time progression cycles in manager scripts", completed: false, estimated_effort: "45m", tags: ["Time Core"] },
          { id: "sub_15_1_2", title: "Write directional light coordinates rotation handlers", completed: false, estimated_effort: "45m", tags: ["Lighting Physics"] }
        ],
        notes: "",
        examples: ["At hour 18:00, pitch changes to -5, skylight intensity lowers to 0.1f, and stars fade in."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using heavy casting loops to locate lighting pointers instead of mapping them on initialization."],
        suggestions: ["Cache directional light components on startup to boost rotation efficiency."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Sun moves smoothly along sky paths, and night colors blend nicely."],
        ai_help_prompts: ["How do I link a SkySphere to dynamic directional rotators inside a C++ tick?"]
      },
      {
        id: "task_15_2",
        title: "Weather transitions manager",
        description: "Program managers driving ambient changes (Rain, RainFX, Fog opacity lines, Wind multipliers).",
        why_this_exists: "Ensures landscapes alter visual feelings smoothly on transitions.",
        steps: [
          "Add fog and particle component pools directly to managers.",
          "Incorporate weather interpolation loops inside tick checks.",
          "Trigger water ripples or wind physics multipliers on vegetation meshes."
        ],
        subtasks: [
          { id: "sub_15_2_1", title: "Create weather particle triggers (Rain particle templates)", completed: false, estimated_effort: "45m", tags: ["FX Particle"] },
          { id: "sub_15_2_2", title: "Apply timelines to interpolate fog distance opacities", completed: false, estimated_effort: "45m", tags: ["Curves Interpolation"] }
        ],
        notes: "",
        examples: ["Weather shift to Rain interpolates fog boundaries to 5000 and activates rain models."],
        dependencies: ["task_15_1"],
        blocked_by: ["task_15_1"],
        common_mistakes: ["Using simple visible state snaps on particle actors which looks ugly and feels rigid."],
        suggestions: ["Use dynamic material parameters to darken ground textures as rain increases."],
        estimated_time: "3h",
        difficulty: "Medium",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Weather states change cleanly over dynamic curves without clipping glitches."],
        ai_help_prompts: ["Show me how to fade volumetric fog properties dynamically using timelines."]
      },
      {
        id: "task_15_3",
        title: "NPC schedule behavior triggers",
        description: "Alert AI systems of time increments, switching patrol points or causing civilians to wander to houses.",
        why_this_exists: "Ensures NPCs exhibit realistic routines, reflecting changes throughout daylight cycles.",
        steps: [
          "Dispatch hour alerts to BAIController models.",
          "Configure schedule data parameters targeting NPCs.",
          "Trigger state transitions to Flee or GoToSleep."
        ],
        subtasks: [
          { id: "sub_15_3_1", title: "Declare schedule indices inside NPC DataAssets", completed: false, estimated_effort: "45m", tags: ["Routines Data"] },
          { id: "sub_15_3_2", title: "Bind routine markers inside state transitions", completed: false, estimated_effort: "45m", tags: ["Transitions AI"] }
        ],
        notes: "",
        examples: ["NPC civilian detects hour is 20:00, changing wandering routines to WalkToHome coordinates."],
        dependencies: ["task_15_2"],
        blocked_by: ["task_15_2"],
        common_mistakes: ["Overriding control coordinates inside sleep tasks without checking path blocking, trapping civilians."],
        suggestions: ["Run path validations on schedules before forcing immediate jumps."],
        estimated_time: "2.5h",
        difficulty: "Medium",
        completed: false,
        priority: "Medium",
        validation_checklist: ["NPC civilian modifies targets and heads to houses cleanly at sunset."],
        ai_help_prompts: ["How do I alertpossessed AI pawns of global time-cycle triggers?"]
      }
    ]
  },
  {
    id: 16,
    number: 16,
    title: "UI / UX Systems",
    description: "Build out player survival HUD interfaces, inventory grids, and active quest trackers.",
    goal: "User interfaces that reflect actual game states, inventories, and progression benchmarks in real-time.",
    why_it_matters: "UI links physical variables and data arrays back to visual screens. Modular canvas structures secure responsive formats.",
    dependencies: ["Phase 9 (Inventory)", "Phase 13 (Quest)", "Phase 12 (Crafting)"],
    blocked_by: ["9", "13", "12"],
    milestones: [
      "HUD system",
      "Inventory UI",
      "Quest UI",
      "Crafting UI",
      "Interaction prompts"
    ],
    examples: [
      "Eating food refills physical healthbars instantly on UI indicators.",
      "Dragging tools inside grid panels shifts inventory indexes smoothly."
    ],
    suggestions: [
      "Repose layout properties cleanly inside dynamic auto-scaling scale boxes.",
      "Avoid running complex calculations inside UI tick graphs."
    ],
    common_mistakes: [
      "Querying player components directly inside every text block check, tanking performance."
    ],
    architecture_notes: [
      "Menus bind to event dispatches. UI elements reflect state data changes cleanly."
    ],
    validation_checklist: [
      "HUD bars display accurate metrics and animate on adjustments.",
      "Inventory grids track and display slots properly.",
      "Active quest lists summarize milestones clearly."
    ],
    ai_prompts: [
      "How do I setup dynamic player statistics UI updates reactively inside Unreal?"
    ],
    estimated_time: "7h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_16_1",
        title: "Dynamic Player HUD",
        description: "Design standard survival HUD overlays reporting Health bars, Stamina values, active items, and prompts.",
        why_this_exists: "Displays critical vitals without requiring players to constantly open character settings tabs.",
        steps: [
          "Bake main HUD overlay panels.",
          "Bind values to health progress controllers.",
          "Animate indicators when thresholds fall below 25% levels."
        ],
        subtasks: [
          { id: "sub_16_1_1", title: "Build player HUD components", completed: false, estimated_effort: "45m", tags: ["UI", "Widget"] },
          { id: "sub_16_1_2", title: "Connect event listeners to vitals variables", completed: false, estimated_effort: "30m", tags: ["Vitals Bindings"] }
        ],
        notes: "",
        examples: ["Sprinting lowers stamina bar heights in real-time, flashing red markers on empty pools."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Putting complex regeneration formulas directly inside UI progress ticks."],
        suggestions: ["Run fluid interpolations on values rather than snapping layouts directly."],
        estimated_time: "3.5h",
        difficulty: "Easy",
        completed: false,
        priority: "High",
        validation_checklist: ["Vitals update and animate cleanly without dropping frames during play session scans."],
        ai_help_prompts: ["Show me how to setup smooth progress bar transitions inside Unreal UI."]
      },
      {
        id: "task_16_2",
        title: "Grid-based Inventory UI",
        description: "Assemble item slot icons, counts overlays, dragging controllers, and detail tooltips panels.",
        why_this_exists: "Allows players to categorize materials, split stacks, and examine item specs.",
        steps: [
          "Draft UI slot panels.",
          "Program drag and drop operations inside scroll grids.",
          "Incorporate tooltip cards querying PDA details."
        ],
        subtasks: [
          { id: "sub_16_2_1", title: "Incorporate drag and drop slots in inventory systems", completed: false, estimated_effort: "60m", tags: ["Slots Dragging"] },
          { id: "sub_16_2_2", title: "Design responsive detail tooltip templates", completed: false, estimated_effort: "45m", tags: ["Tooltips UI"] }
        ],
        notes: "",
        examples: ["Hovering on Pickaxe opens details box displaying: 'Gathering Pickaxe, Damage 25, Tier 1'."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Hardcoding slot card components on layouts, blocking scrolling expansion."],
        suggestions: ["Create a universal child item card, spawning instances dynamically in scroll boxes."],
        estimated_time: "3.5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Dragging moves elements cleanly, and tooltips display accurate attributes."],
        ai_help_prompts: ["How do I construct drag-and-drop slots in an Unreal ScrollBox?"]
      }
    ]
  },
  {
    id: 17,
    number: 17,
    title: "Audio System",
    description: "Incorporate surface-based dynamic footstep sounds, ambient environmental sounds, and feedback sounds.",
    goal: "Satisfying spatial audio layer that guides player inputs and world immersion.",
    why_it_matters: "A silent landscape feels hollow. Sound feedback is what makes physical swing, impacts, and footsteps feel authentic.",
    dependencies: ["Phase 1 (Character movement)"],
    blocked_by: ["1"],
    milestones: [
      "Footstep system",
      "Ambient sounds",
      "Interaction sounds",
      "Combat sounds"
    ],
    examples: [
      "Running on grass fires soft grassy rustles, walking on gravel switches footsteps to crisp clicks.",
      "Weapon swings trigger wind swooshes."
    ],
    suggestions: [
      "Use line sweeps from feet to identify physical materials before choosing footstep tracks.",
      "Vary footstep frequencies based on walk and run velocities."
    ],
    common_mistakes: [
      "Playing basic walking sound loop loops that ignore physical materials, breaking immersion instantly."
    ],
    architecture_notes: [
      "Physical materials map cleanly to audio cues inside character sound managers."
    ],
    validation_checklist: [
      "Surface-specific sounds play accurately on walking shifts.",
      "Swinging weapons and hitting resources triggers audio loops nicely.",
      "Ambient sounds blend elegantly as hours progress."
    ],
    ai_prompts: [
      "How do I setup surface-based dynamic footstep sounds in UE5?"
    ],
    estimated_time: "5h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_17_1",
        title: "Dynamic Footstep System",
        description: "Run line traces down from feet on anim cues, checking surface physical materials to trigger matching step sound cues.",
        why_this_exists: "Guarantees footstep sounds are accurately paired with the terrain characters trek across.",
        steps: [
          "Bake terrain physical materials (Grass, Rock, Dirt, Water).",
          "Hook traces inside move animation tracks.",
          "Identify hit parameters and launch suited footsteps sound."
        ],
        subtasks: [
          { id: "sub_17_1_1", title: "Map physical terrain texture profiles inside editor configurations", completed: false, estimated_effort: "45m", tags: ["Physics Terrain"] },
          { id: "sub_17_1_2", title: "Connect socket trace alerts to animations keys", completed: false, estimated_effort: "45m", tags: ["Footsteps Triggers"] }
        ],
        notes: "",
        examples: ["Walking from beach sand onto grass alternates footsteps from sandy crunches to grassy steps."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using dynamic tick distance checks inside character controller trees, lagging updates."],
        suggestions: ["Incorporate random pitch variations (0.95f to 1.15f) to avoid robotic repetitions."],
        estimated_time: "5h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Alternating surfaces alerts different footsteps and pitch balances correctly."],
        ai_help_prompts: ["How do I program surface physical material lookups in Unreal C++?"]
      }
    ]
  },
  {
    id: 18,
    number: 18,
    title: "Optimization System",
    description: "Incorporate actor distance culling limits, LOD systems, AI tick decimations, and runtime performance checks.",
    goal: "Safe performance rules that preserve frame rates as map item totals grow.",
    why_it_matters: "RPGs must scale. Distant items should strip resource-heavy updating, maximizing visual quality on focused assets.",
    dependencies: ["Phase 2 (World actors)", "Phase 7 (AI)"],
    blocked_by: ["2", "7"],
    milestones: [
      "Actor culling",
      "LOD system",
      "AI optimization",
      "Performance profiling tools"
    ],
    examples: [
      "Distant nodes halt ticks, hiding mesh models upon passing set distances.",
      "Inactive AI entities lower update ticks to once per second."
    ],
    suggestions: [
      "Leverage HLODs and system culling maps to scale environment setups efficiently.",
      "Dampen AI perception ranges dynamically based on visibility."
    ],
    common_mistakes: [
      "Leaving tick events activated on thousands of passive trees or rocks, freezing computers."
    ],
    architecture_notes: [
      "UWorldSignificanceManager manages actor importance metrics, guiding ticking priorities."
    ],
    validation_checklist: [
      "Entities drop active ticks upon crossing coordinate boundaries.",
      "Distant assets transition cleanly between LOD layers.",
      "AI models lower tick loops when out of sights."
    ],
    ai_prompts: [
      "How do I implement actor culling and significance checks in Unreal projects?"
    ],
    estimated_time: "5h",
    difficulty: "Hard",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_18_1",
        title: "Actor Significance culling",
        description: "Configure dynamic culling radii on resource nodes, stopping active tickers on far entities.",
        why_this_exists: "Saves memory and CPU loops, avoiding lag spikes inside large level layouts.",
        steps: [
          "Bake Significance checking arrays inside world managers.",
          "Identify far resources and turn off visible meshes and ticks.",
          "Restore structures smoothly when player avatars approach."
        ],
        subtasks: [
          { id: "sub_18_1_1", title: "Write dynamic culling sweeps inside system controllers", completed: false, estimated_effort: "45m", tags: ["Optimization Sweeps"] },
          { id: "sub_18_1_2", title: "Assemble visual LOD profiles on resource node models", completed: false, estimated_effort: "45m", tags: ["LOD Parameters"] }
        ],
        notes: "",
        examples: ["Rocks further than 4000cm turn off mesh renderers and ticks, saving massive loops."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using heavy coordinates checks inside every frame tick, reversing optimization perks."],
        suggestions: ["Use simple collision spheres as culling volumes instead of math checks."],
        estimated_time: "5h",
        difficulty: "Hard",
        completed: false,
        priority: "High",
        validation_checklist: ["Ticks turn off successfully on far entities, boosting FPS counters."],
        ai_help_prompts: ["How do I dynamically enable and disable actor mesh ticks in C++?"]
      }
    ]
  },
  {
    id: 19,
    number: 19,
    title: "Content Pipeline",
    description: "Build robust templates supporting rapid, data-driven resource and NPC assets creation pathways.",
    goal: "Flexible design rules facilitating fast new asset creations without code modifications.",
    why_it_matters: "Scale depends on how quickly team members can assemble content. Inflexible asset trees block smooth expansion.",
    dependencies: ["Phase 2 (World actors)"],
    blocked_by: ["2"],
    milestones: [
      "Data-driven content creation",
      "Template actors",
      "Fast duplication system"
    ],
    examples: [
      "Adding a Gold Vein rock simply requires saving a new GoldNode item asset profile in folders."
    ],
    suggestions: [
      "Create modular child blueprints that inherit directly from BP_WorldActor_Base.",
      "Structure variables cleanly inside separate DataAssets blocks."
    ],
    common_mistakes: [
      "Force-creating entirely custom blueprint classes per item variation, cluttering directories."
    ],
    architecture_notes: [
      "A clean assets loading layer populates child components dynamically, keeping directories small."
    ],
    validation_checklist: [
      "Instantiating child nodes updates parameters without script overrides.",
      "Adding custom models takes minutes inside content folders."
    ],
    ai_prompts: [
      "Recommend streamlined content pipeline workflows inside Unreal RPGs."
    ],
    estimated_time: "4h",
    difficulty: "Easy",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_19_1",
        title: "Dynamic Asset Templates setup",
        description: "Assemble standard templates that dynamically initialize parameters, simplifying node spawning.",
        why_this_exists: "Saves hours of duplicate configurations, facilitating steady project extensions.",
        steps: [
          "Create baseline resource actor blueprints.",
          "Bake data-binding helpers aligning Mesh components to variables.",
          "Document standard variables mapping tables."
        ],
        subtasks: [
          { id: "sub_19_1_1", title: "Build standardized actor subclass layouts", completed: false, estimated_effort: "30m", tags: ["Item Templates"] },
          { id: "sub_19_1_2", title: "Establish directory profiles for asset parameters", completed: false, estimated_effort: "30m", tags: ["Data assets"] }
        ],
        notes: "",
        examples: ["Duplicating OakTree class generates BirchTree, updating variables instantly from BirchDA."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Configuring properties individually inside level meshes, losing asset syncing."],
        suggestions: ["Always define defaults inside DataAssets instead of on individual placements."],
        estimated_time: "4h",
        difficulty: "Easy",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Asset copies update variables correctly without breaking parent scripts."],
        ai_help_prompts: ["How do I construct custom blueprint class templates in Unreal Engine?"]
      }
    ]
  },
  {
    id: 20,
    number: 20,
    title: "Polish Phase",
    description: "Polish animations transitions, UI layouts feedback animations, particle FX cues, and camera interpolations.",
    goal: "Fluid, satisfying visual reactions across standard survival and interactive systems.",
    why_it_matters: "A feature-rich game can still feel cheap without subtle polish. Visual and tactile feedback is the mark of a complete game.",
    dependencies: ["Phase 16 (UI / UX Systems)"],
    blocked_by: ["16"],
    milestones: [
      "Animation polish",
      "UI polish",
      "Feedback systems",
      "FX improvements"
    ],
    examples: [
      "Gathering resources triggers screen vibration and subtle foliage sway effects.",
      "Hovering on menu cards features smooth, animated button scaling."
    ],
    suggestions: [
      "Use dynamic UI material elements to display glowing feedback loops.",
      "Trigger dust, sparks, and screenshakes on physical impacts."
    ],
    common_mistakes: [
      "Rushing systems releases before polishing core interaction loops, making games look raw."
    ],
    architecture_notes: [
      "FX alerts manage visual particle spawns asynchronously, avoiding processor overhead."
    ],
    validation_checklist: [
      "Movement transitions look smooth and avoid visual pops.",
      "UI panels animate open and button hovers feedback smoothly.",
      "FX particles spawn at correct sockets during impact instances."
    ],
    ai_prompts: [
      "Show me how to setup high-fidelity hit stagger animations inside Unreal."
    ],
    estimated_time: "4h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_20_1",
        title: "Interaction and Vibe Polish",
        description: "Bake particle dust, spark FX, screenshake matrices, and menu animation triggers.",
        why_this_exists: "Turns functional actions into satisfying, heavy movements with spatial depth.",
        steps: [
          "Apply spring-shake equations to player view camera sweeps.",
          "Incorporate visual glow states on targeting interactive nodes.",
          "Add gentle hover transitions inside inventory grid menus."
        ],
        subtasks: [
          { id: "sub_20_1_1", title: "Design high-contrast visual cues on targeted models", completed: false, estimated_effort: "30m", tags: ["PostProcess Outline"] },
          { id: "sub_20_1_2", title: "Build widget transitions inside inventory panels", completed: false, estimated_effort: "45m", tags: ["UI Transitions"] }
        ],
        notes: "",
        examples: ["Swinging steel pickaxes on IronNode flashes bright metal sparks and rings metallic hit sounds."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Using raw snaps on UI parameters which looks retro-stiff and raw."],
        suggestions: ["Use dynamic materials on outlined targets to make interactive cues stand out."],
        estimated_time: "4h",
        difficulty: "Medium",
        completed: false,
        priority: "Medium",
        validation_checklist: ["Vibrations and particle systems trigger cleanly on world resource hits."],
        ai_help_prompts: ["How do I dynamically enable model post-process outline triggers on hover?"]
      }
    ]
  },
  {
    id: 21,
    number: 21,
    title: "QA / Bug Fixing",
    description: "Stabilize game systems, fix duplication anomalies, check boundary colliders, and refine performance limits.",
    goal: "Bug-free, stable, and balanced game systems ready for package distribution.",
    why_it_matters: "Glitches break immersion. Ironing out item duplication exploits and floating meshes secures build credibility.",
    dependencies: ["Phase 6 (Health)", "Phase 11 (Combat)", "Phase 8 (Save system)"],
    blocked_by: ["6", "11", "8"],
    milestones: [
      "Fix bugs",
      "Balance systems",
      "Remove duplication issues",
      "Improve performance"
    ],
    examples: [
      "Resolving item duplication checks: dragging and dropping items concurrently is locked down safely.",
      "Correcting mesh heights: trees sit flush with terrains."
    ],
    suggestions: [
      "Incorporate robust automated telemetry checks inside gameplay sessions.",
      "Track memory footprints during repeated save/load cycles."
    ],
    common_mistakes: [
      "Releasing packages containing loose files or missing model pointers."
    ],
    architecture_notes: [
      "Profiling metrics monitor ticking budgets, guiding optimal component divisions."
    ],
    validation_checklist: [
      "Repeated save and loads restore identical landscape positions.",
      "Duplication vectors during rapid menu splits stand fully neutralized.",
      "Collidables possess accurate physics profiles, allowing zero map slips."
    ],
    ai_prompts: [
      "How do I trace and patch memory leaks inside Unreal Engine C++ systems?"
    ],
    estimated_time: "6h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_21_1",
        title: "Gameplay System Balance",
        description: "Run automated stress testing sequences during save operations, tracing and patching variable anomalies.",
        why_this_exists: "Guarantees that players don't experience crashes or corrupted inventories after hours of play.",
        steps: [
          "Bake testing loops inside global managers templates.",
          "Stress test inventory splits and transaction logs.",
          "Identify and patch collision bypasses along solid rocks."
        ],
        subtasks: [
          { id: "sub_21_1_1", title: "Construct automated save/load stress testers", completed: false, estimated_effort: "45m", tags: ["Automated Scanners"] },
          { id: "sub_21_1_2", title: "Scan level borders verifying bounds are secure", completed: false, estimated_effort: "45m", tags: ["Borders Cleaners"] }
        ],
        notes: "",
         examples: ["Simulating 100 rapid inventory splits blocks anomalous items duplication vectors cleanly."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Omitting boundaries checks, letting player models step out of world geometry grids."],
        suggestions: ["Set custom blocked boxes covering map boundaries to seal exploration frames."],
        estimated_time: "6h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Inventories and coordinates maintain perfect stability under stress testing checks."],
        ai_help_prompts: ["How do I setup automated session profiling checks inside Unreal Editor?"]
      }
    ]
  },
  {
    id: 22,
    number: 22,
    title: "Release Preparation",
    description: "Prepare and bundle final packages, configure option controls parameters, and run final save stability tests.",
    goal: "Distribution-ready game build packaged with operational user control options.",
    why_it_matters: "A pristine release marks completion. Safe bundle frameworks and operational Settings tabs certify stable exports.",
    dependencies: ["Phase 21 (QA / Bug Fixing)"],
    blocked_by: ["21"],
    milestones: [
      "Build packaging",
      "Settings menu",
      "Controls menu",
      "Save stability check",
      "Final testing"
    ],
    examples: [
      "Packaging triggers compression algorithms, building folder directories for distribution.",
      "Settings options map mouse speed multipliers cleanly."
    ],
    suggestions: [
      "Maintain culling directories to reject debug-only assets from distribution builds.",
      "Run final validation runs on USaveGame slots before release."
    ],
    common_mistakes: [
      "Leaving massive high-resolution debug traces enabled inside packaged distribution files."
    ],
    architecture_notes: [
      "Build outputs compile neatly, discarding loose editor structures to optimize sizes."
    ],
    validation_checklist: [
      "Bundling sequences output compile files without errors.",
      "Settings menu adjust coordinates, volume indicators, and camera metrics correctly.",
      "Save structures load records safely in stand-alone games."
    ],
    ai_prompts: [
      "Suggest packaging configurations targeting optimized sizes in Unreal Engine."
    ],
    estimated_time: "6h",
    difficulty: "Medium",
    progress: 0,
    notes: "",
    status: "Locked",
    tasks: [
      {
        id: "task_22_1",
        title: "Final Packaging Release bundle",
        description: "Configure options controls (volume indices, camera slider sensitivities), compile game content, and bundle release assets.",
        why_this_exists: "Ensures the development cycle resolves in a fully playable, stand-alone experience for players.",
        steps: [
          "Connect active volume controls to global Sound Mixer assets.",
          "Map controls speed variables inside dynamic Enhanced Input structures.",
          "Run final packaging tests discarding debug lines logs."
        ],
        subtasks: [
          { id: "sub_22_1_1", title: "Build settings menus widgets", completed: false, estimated_effort: "45m", tags: ["UI Settings"] },
          { id: "sub_22_1_2", title: "Run final packaging compression checks inside project maps", completed: false, estimated_effort: "45m", tags: ["Packaging Check"] }
        ],
        notes: "",
        examples: ["Pressing Package runs build optimization, outputting a zipped directory with game files."],
        dependencies: [],
        blocked_by: [],
        common_mistakes: ["Forgetting to assign default levels, launching users into empty test areas."],
        suggestions: ["Bake controls keys bindings maps into visual menus layout charts so players check configurations easily."],
        estimated_time: "6h",
        difficulty: "Medium",
        completed: false,
        priority: "High",
        validation_checklist: ["Setting changes apply cleanly, and game bundles compile successfully."],
        ai_help_prompts: ["How do I design dynamic settings menus models that alter engine configurations?"]
      }
    ]
  }
];
