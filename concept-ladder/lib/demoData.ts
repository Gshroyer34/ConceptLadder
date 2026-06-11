import type {
  DrillableTerm,
  DrilldownInput,
  DrilldownOutput,
  ExplainInput,
  ExplainOutput,
  LearnerLevel
} from "@/types/learning";
import { compactTerms, normalizeTerm } from "@/lib/text";

type SeededConcept = {
  aliases: string[];
  explanation: ExplainOutput;
  drilldowns: Record<string, DrilldownOutput>;
};

function term(term: string, reason: string, difficulty: DrillableTerm["difficulty"]): DrillableTerm {
  return { term, reason, difficulty };
}

function key(parent: string, selected: string) {
  return `${normalizeTerm(parent)}::${normalizeTerm(selected)}`;
}

const seededConcepts: SeededConcept[] = [
  {
    aliases: ["kubernetes", "k8s", "what is kubernetes"],
    explanation: {
      concept: "Kubernetes",
      level: "beginner",
      summary:
        "Kubernetes is a system for running applications across a group of machines. Teams package app pieces into containers, then ask Kubernetes to keep the right number of copies running. It watches the desired state, places work onto nodes inside a cluster, restarts failed pods, and helps with scaling when traffic changes. Instead of a person manually checking every server, Kubernetes keeps comparing what should be true with what is actually running and takes action when they drift apart.",
      key_terms: [
        term("containers", "Kubernetes mainly runs and manages containerized app pieces.", "medium"),
        term("cluster", "The group of machines Kubernetes coordinates.", "easy"),
        term("desired state", "The target condition Kubernetes tries to maintain.", "medium"),
        term("nodes", "The machines that run application work.", "easy"),
        term("pods", "The smallest deployable unit in Kubernetes.", "medium"),
        term("scaling", "A core reason teams use Kubernetes in production.", "easy")
      ],
      prerequisites: ["application", "server", "container"],
      analogy:
        "Think of Kubernetes like an operations manager for apps: you describe what should be running, and it keeps checking the floor until reality matches the plan.",
      check_understanding: [
        {
          question: "What does Kubernetes keep comparing?",
          expected_answer: "It compares the desired state with what is actually running."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("Kubernetes", "containers")]: {
        term: "containers",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "In Kubernetes, containers are packaged units of application code and the settings needed to run that code. Kubernetes does not usually start raw source files by itself; it starts containers from container images. Because each container starts in a consistent way, Kubernetes can move it, restart it, or run more copies on different machines without a human reinstalling the app each time.",
        why_it_matters_here:
          "Containers are the work units Kubernetes schedules, restarts, and scales across a cluster.",
        new_terms: ["container image", "runtime", "process isolation", "Docker"],
        depth_warning: false,
        simple_example:
          "A checkout service can be packaged as a container, and Kubernetes can run five copies when the store gets busy.",
        safety_note: null
      },
      [key("containers", "container image")]: {
        term: "container image",
        parent_concept: "containers",
        contextual_explanation:
          "A container image is the saved package used to create a running container. It includes the application files, dependency instructions, and startup command. In Kubernetes, a pod points to an image, and the node pulls that image before starting the container. The image is like a recipe plus sealed ingredients; the running container is the meal made from it.",
        why_it_matters_here:
          "Kubernetes needs images so it can create the same container repeatedly on any suitable node.",
        new_terms: ["runtime", "registry", "layers"],
        depth_warning: false,
        simple_example:
          "If an image says to run a web server on port 8080, Kubernetes can use it to start identical web server containers.",
        safety_note: null
      },
      [key("container image", "runtime")]: {
        term: "runtime",
        parent_concept: "container image",
        contextual_explanation:
          "A container runtime is the software on a node that actually starts and stops containers from images. Kubernetes decides what should run, then asks the runtime to do the low-level work. The runtime talks to the operating system so the container gets its process, filesystem view, and resource limits.",
        why_it_matters_here:
          "Without a runtime, Kubernetes would have plans and images but no local engine to turn them into running containers.",
        new_terms: ["containerd", "kernel", "process"],
        depth_warning: true,
        simple_example:
          "Kubernetes may schedule a pod onto a node, then containerd pulls the image and starts the container process.",
        safety_note: null
      },
      [key("Kubernetes", "cluster")]: {
        term: "cluster",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "A Kubernetes cluster is the full set of machines and control services working together. Some parts decide what should happen, while worker machines run the app workloads. The cluster gives teams one coordinated environment instead of a pile of separate servers that must be managed one by one.",
        why_it_matters_here:
          "Kubernetes is valuable because it treats many machines as one coordinated platform for applications.",
        new_terms: ["node", "control plane", "networking", "pods"],
        depth_warning: false,
        simple_example:
          "A cluster might have three worker machines running app pods and a control plane deciding where new pods should go.",
        safety_note: null
      },
      [key("cluster", "node")]: {
        term: "node",
        parent_concept: "cluster",
        contextual_explanation:
          "A node is a machine inside a Kubernetes cluster that can run application work. It can be a physical server or a virtual machine. Kubernetes checks each node's available CPU, memory, and health before placing pods there. Nodes also run local agents that report back to the cluster and make sure assigned pods keep running.",
        why_it_matters_here:
          "Nodes are where Kubernetes turns scheduling decisions into actual running applications.",
        new_terms: ["pod", "kubelet", "capacity", "scheduler"],
        depth_warning: false,
        simple_example:
          "If one node is full, Kubernetes can place the next pod on another healthier node with more room.",
        safety_note: null
      },
      [key("node", "pod")]: {
        term: "pod",
        parent_concept: "node",
        contextual_explanation:
          "A pod is the smallest unit Kubernetes places on a node. It usually holds one main container, though it can hold closely related containers that need to share networking or storage. Kubernetes schedules pods rather than individual app files, so pods are the practical shape of work that lands on nodes.",
        why_it_matters_here:
          "Understanding pods explains what Kubernetes actually starts, stops, moves, and replaces.",
        new_terms: ["container", "IP address", "volume"],
        depth_warning: false,
        simple_example:
          "A pod might run one API container with its own cluster IP address so other services can reach it.",
        safety_note: null
      },
      [key("Kubernetes", "desired state")]: {
        term: "desired state",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Desired state is the version of the system you asked Kubernetes to maintain. You might say that three copies of an API should be running. Kubernetes constantly compares that request with reality. If one copy crashes, reality no longer matches the desired state, so Kubernetes starts another copy.",
        why_it_matters_here:
          "Desired state is the mental model behind Kubernetes automation.",
        new_terms: ["declarative configuration", "controller", "reconciliation"],
        depth_warning: false,
        simple_example:
          "If desired state is three pods and only two are healthy, Kubernetes creates or restarts one.",
        safety_note: null
      },
      [key("Kubernetes", "nodes")]: {
        term: "nodes",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Nodes are the machines Kubernetes uses to run pods. Each node contributes compute capacity, such as CPU and memory. Kubernetes watches node health and chooses suitable nodes for new work. If a node fails, Kubernetes can move replacement pods to other healthy nodes.",
        why_it_matters_here:
          "Kubernetes coordinates nodes so applications are not tied to one fragile machine.",
        new_terms: ["pod", "kubelet", "capacity"],
        depth_warning: false,
        simple_example:
          "A cluster with six nodes can keep an app running even if one node needs maintenance.",
        safety_note: null
      },
      [key("Kubernetes", "pods")]: {
        term: "pods",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Pods are Kubernetes' smallest deployable units. A pod wraps one or more containers with shared networking and lifecycle rules. Kubernetes creates, replaces, and schedules pods to keep applications running according to the desired state.",
        why_it_matters_here:
          "Most Kubernetes actions eventually affect pods, so pods are the center of the app-running story.",
        new_terms: ["container", "scheduler", "service"],
        depth_warning: false,
        simple_example:
          "A deployment may ask Kubernetes to keep three identical API pods running at all times.",
        safety_note: null
      },
      [key("Kubernetes", "scaling")]: {
        term: "scaling",
        parent_concept: "Kubernetes",
        contextual_explanation:
          "Scaling means changing how much app capacity is running. In Kubernetes, that often means increasing or decreasing the number of pod copies. More pods can handle more traffic; fewer pods can save resources when demand falls.",
        why_it_matters_here:
          "Scaling is one of the main jobs Kubernetes automates once apps are packaged as pods.",
        new_terms: ["replica", "autoscaling", "resource limits"],
        depth_warning: false,
        simple_example:
          "During a sale, Kubernetes might raise an app from three pods to ten pods, then lower it later.",
        safety_note: null
      }
    }
  },
  {
    aliases: ["neural networks", "neural network", "how do neural networks learn"],
    explanation: {
      concept: "Neural networks",
      level: "beginner",
      summary:
        "Neural networks are computer systems that learn patterns from examples. They are made of layers of small calculation units often called neurons. Each connection has a weight that controls how strongly one value affects the next. During training, the network looks at training data, makes a prediction, measures the error with a loss function, and adjusts weights through backpropagation. After many examples, the network can make useful predictions on new inputs that resemble what it learned from.",
      key_terms: [
        term("neurons", "The small calculation units that make up a network.", "easy"),
        term("layers", "How neurons are organized into stages.", "easy"),
        term("weights", "The adjustable values the network learns.", "medium"),
        term("training data", "The examples used to teach the network.", "easy"),
        term("loss function", "The score that tells the network how wrong it was.", "medium"),
        term("backpropagation", "The method used to update weights after errors.", "hard")
      ],
      prerequisites: ["data", "prediction", "function"],
      analogy:
        "Think of a neural network like a sound mixer with many knobs; training slowly turns the knobs until the output sounds closer to the target.",
      check_understanding: [
        {
          question: "What changes while a neural network learns?",
          expected_answer: "Its weights change based on errors measured during training."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("Neural networks", "neurons")]: {
        term: "neurons",
        parent_concept: "Neural networks",
        contextual_explanation:
          "In a neural network, a neuron is a small calculation that receives numbers, combines them using weights, and passes a result forward. It is not a tiny brain cell; it is a math step. Many simple neurons connected together can model complicated patterns.",
        why_it_matters_here:
          "Neurons are the basic units that let a neural network transform inputs into predictions.",
        new_terms: ["activation", "input", "output"],
        depth_warning: false,
        simple_example:
          "A neuron might combine pixel brightness values to help detect whether part of an image contains an edge.",
        safety_note: null
      },
      [key("Neural networks", "layers")]: {
        term: "layers",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Layers are groups of neurons that process information in stages. Early layers often detect simple patterns, while later layers combine those patterns into more useful signals. The output of one layer becomes the input to the next.",
        why_it_matters_here:
          "Layers explain how a network builds from raw input toward a final prediction.",
        new_terms: ["input layer", "hidden layer", "output layer"],
        depth_warning: false,
        simple_example:
          "In an image model, one layer may detect edges while a later layer helps recognize wheels or windows.",
        safety_note: null
      },
      [key("Neural networks", "weights")]: {
        term: "weights",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Weights are adjustable numbers on the connections between neurons. A larger weight makes one signal matter more; a smaller weight makes it matter less. Learning mostly means changing weights so the network's predictions get closer to the right answers.",
        why_it_matters_here:
          "Weights are the memory of what the network has learned from training data.",
        new_terms: ["gradient", "parameter", "optimization"],
        depth_warning: false,
        simple_example:
          "If a word is a strong clue for spam, the network may learn a higher weight for that signal.",
        safety_note: null
      },
      [key("Neural networks", "training data")]: {
        term: "training data",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Training data is the collection of examples the network learns from. Each example gives the model input, and often a target answer. The quality and variety of this data strongly affects what the network can learn and where it may fail.",
        why_it_matters_here:
          "A neural network cannot learn useful patterns without examples that represent the task.",
        new_terms: ["label", "dataset", "generalization"],
        depth_warning: false,
        simple_example:
          "A model that identifies handwritten digits needs many images of digits paired with their correct labels.",
        safety_note: null
      },
      [key("Neural networks", "loss function")]: {
        term: "loss function",
        parent_concept: "Neural networks",
        contextual_explanation:
          "A loss function is a score that measures how far the network's prediction is from the target answer. Training tries to reduce this score. The network uses the loss to know which direction to adjust its weights.",
        why_it_matters_here:
          "The loss function gives the network feedback; without it, training would not know what better means.",
        new_terms: ["error", "optimization", "gradient"],
        depth_warning: false,
        simple_example:
          "If the correct price is 100 and the model predicts 70, the loss tells training that the prediction missed by a lot.",
        safety_note: null
      },
      [key("Neural networks", "backpropagation")]: {
        term: "backpropagation",
        parent_concept: "Neural networks",
        contextual_explanation:
          "Backpropagation is the method that sends error information backward through the network after a prediction. It calculates how much each weight contributed to the error, then training uses those calculations to adjust the weights.",
        why_it_matters_here:
          "Backpropagation is the practical mechanism that lets deep networks learn from mistakes.",
        new_terms: ["gradient", "learning rate", "chain rule"],
        depth_warning: false,
        simple_example:
          "If the final answer is wrong, backpropagation works backward to decide which earlier knobs should turn slightly.",
        safety_note: null
      }
    }
  },
  {
    aliases: ["oauth", "oauth 2", "oauth2", "oauth 2.0"],
    explanation: {
      concept: "OAuth",
      level: "beginner",
      summary:
        "OAuth is a way for one app to get limited access to something you use in another service without asking for your password. Instead of giving a calendar app your Google password, you approve a specific permission. An authorization server checks the login and issues an access token. The client app uses that token to call an API, and scopes limit what the token can do. OAuth is mainly about authorization: letting an app do a specific thing on your behalf.",
      key_terms: [
        term("authorization", "OAuth is about granting permission, not sharing passwords.", "medium"),
        term("client app", "The app requesting access.", "easy"),
        term("authorization server", "The service that handles approval and token issuing.", "medium"),
        term("access token", "The short-lived credential used by the app.", "medium"),
        term("scopes", "The permissions attached to a token.", "easy"),
        term("redirect URI", "The approved return address after login.", "medium")
      ],
      prerequisites: ["API", "account", "permission"],
      analogy:
        "OAuth is like giving a valet key: it grants limited access for a purpose without handing over the master key.",
      check_understanding: [
        {
          question: "What does OAuth help avoid sharing?",
          expected_answer: "It helps avoid sharing the user's password with the client app."
        }
      ],
      safety_note: null
    },
    drilldowns: {
      [key("OAuth", "authorization")]: {
        term: "authorization",
        parent_concept: "OAuth",
        contextual_explanation:
          "Authorization means deciding what an app is allowed to do. In OAuth, the user or service grants limited permission, such as reading calendar events. This is different from authentication, which is proving who the user is.",
        why_it_matters_here:
          "OAuth exists to grant limited permissions safely between apps.",
        new_terms: ["authentication", "permission", "resource owner"],
        depth_warning: false,
        simple_example:
          "You can authorize a scheduling app to read your calendar without letting it delete emails.",
        safety_note: null
      },
      [key("OAuth", "client app")]: {
        term: "client app",
        parent_concept: "OAuth",
        contextual_explanation:
          "The client app is the application asking for access to a protected resource. It could be a web app, mobile app, or backend service. The client app does not need your password; it asks the authorization server for a token after you approve access.",
        why_it_matters_here:
          "The client app is the actor OAuth is trying to empower without over-trusting.",
        new_terms: ["client ID", "client secret", "public client"],
        depth_warning: false,
        simple_example:
          "A travel app that wants to add flights to your calendar is the OAuth client app.",
        safety_note: null
      },
      [key("OAuth", "authorization server")]: {
        term: "authorization server",
        parent_concept: "OAuth",
        contextual_explanation:
          "The authorization server is the trusted system that handles login, consent, and token issuing. It checks who the user is, asks what access is allowed, and gives the client app an access token if the request is valid.",
        why_it_matters_here:
          "It keeps password handling and permission decisions away from the client app.",
        new_terms: ["consent screen", "token endpoint", "issuer"],
        depth_warning: false,
        simple_example:
          "Google's OAuth server can ask you to approve a calendar permission and then issue a token to the app.",
        safety_note: null
      },
      [key("OAuth", "access token")]: {
        term: "access token",
        parent_concept: "OAuth",
        contextual_explanation:
          "An access token is a credential the client app sends to an API to prove it has permission. Tokens are usually limited by time and scope. The API reads the token, checks whether the requested action is allowed, and responds if the token is valid.",
        why_it_matters_here:
          "The token is what replaces password sharing in the OAuth flow.",
        new_terms: ["bearer token", "expiration", "resource server"],
        depth_warning: false,
        simple_example:
          "A calendar API may accept a token that allows reading events for the next hour.",
        safety_note: null
      },
      [key("OAuth", "scopes")]: {
        term: "scopes",
        parent_concept: "OAuth",
        contextual_explanation:
          "Scopes are named permissions attached to an OAuth request or token. They limit what the client app can do. A token with read-only scope should not be able to write or delete data.",
        why_it_matters_here:
          "Scopes make OAuth useful because access can be specific instead of all-or-nothing.",
        new_terms: ["least privilege", "consent", "API permission"],
        depth_warning: false,
        simple_example:
          "A photo app might request a scope to read albums but not upload or delete photos.",
        safety_note: null
      },
      [key("OAuth", "redirect URI")]: {
        term: "redirect URI",
        parent_concept: "OAuth",
        contextual_explanation:
          "A redirect URI is the approved address where the authorization server sends the user after approval. It helps ensure the OAuth response goes back to the correct client app instead of an attacker-controlled location.",
        why_it_matters_here:
          "Redirect URIs are part of how OAuth keeps the handoff between services controlled.",
        new_terms: ["authorization code", "callback", "registered client"],
        depth_warning: false,
        simple_example:
          "After you approve access, the browser returns to the app's registered callback URL with a temporary code.",
        safety_note: null
      }
    }
  }
];

export function getSeededExplanation(input: ExplainInput): ExplainOutput {
  const seeded = findSeededConcept(input.user_goal);

  if (seeded) {
    return withRequestedLevel(seeded.explanation, input.learner_level);
  }

  return createGenericExplanation(input.user_goal, input.learner_level);
}

export function getSeededDrilldown(input: DrilldownInput): DrilldownOutput {
  const seeded = findSeededConcept(input.root_concept);
  const lookupKey = key(input.parent_concept, input.selected_text);
  const output = seeded?.drilldowns[lookupKey];

  if (output) {
    return output;
  }

  return createGenericDrilldown(input);
}

function findSeededConcept(goal: string) {
  const normalizedGoal = normalizeTerm(goal);

  return seededConcepts.find((concept) =>
    concept.aliases.some((alias) => {
      const normalizedAlias = normalizeTerm(alias);
      return normalizedGoal === normalizedAlias || normalizedGoal.includes(normalizedAlias);
    })
  );
}

function withRequestedLevel(output: ExplainOutput, learnerLevel: LearnerLevel): ExplainOutput {
  if (output.level === learnerLevel) {
    return output;
  }

  const levelNudge =
    learnerLevel === "expert"
      ? "This version assumes you are comfortable with technical vocabulary and focuses on mechanism."
      : learnerLevel === "intermediate"
        ? "This version keeps the framing practical while preserving the key technical relationships."
        : "This version keeps the explanation plain and concrete.";

  return {
    ...output,
    level: learnerLevel,
    summary: `${output.summary} ${levelNudge}`
  };
}

function createGenericExplanation(userGoal: string, learnerLevel: LearnerLevel): ExplainOutput {
  const concept = userGoal.trim() || "the concept";
  const lowerConcept = concept.toLowerCase();
  const keyTerms = compactTerms([
    term("core idea", `The central purpose behind ${concept}.`, "easy"),
    term("main parts", `The pieces that make ${concept} easier to reason about.`, "easy"),
    term("tradeoffs", `The costs and compromises that shape ${concept}.`, "medium"),
    term("real example", `A concrete way to connect ${concept} to practice.`, "easy")
  ]);

  return {
    concept,
    level: learnerLevel,
    summary:
      `${concept} is best understood by separating the core idea from the details around it. Start with what problem ${lowerConcept} is meant to solve, then identify the main parts involved, the tradeoffs those parts create, and one real example where the idea shows up. This keeps the learning path grounded: instead of memorizing definitions, you can connect each new term back to why it matters for understanding ${lowerConcept}.`,
    key_terms: keyTerms,
    prerequisites: ["problem", "system", "example"],
    analogy:
      "Think of it like learning a new neighborhood: first find the main streets, then explore the side streets only when they help you get oriented.",
    check_understanding: [
      {
        question: `What problem does ${concept} help solve?`,
        expected_answer: "A good answer should name the practical problem before naming the tools or details."
      }
    ],
    safety_note: null
  };
}

function createGenericDrilldown(input: DrilldownInput): DrilldownOutput {
  const termText = input.selected_text.trim();
  const parent = input.parent_concept.trim();

  return {
    term: termText,
    parent_concept: parent,
    contextual_explanation:
      `${termText} matters here because it is one of the ideas that supports ${parent}. In this context, you do not need a full encyclopedia definition yet. Focus on how ${termText.toLowerCase()} changes what ${parent.toLowerCase()} can do, what problem it helps solve, and what new decision it introduces. Once that relationship is clear, the parent concept becomes easier to hold in your head.`,
    why_it_matters_here:
      `Understanding ${termText.toLowerCase()} helps explain a specific part of ${parent}, instead of becoming a separate research detour.`,
    new_terms: ["purpose", "mechanism", "example"],
    depth_warning: input.breadcrumb_path.length >= 4,
    simple_example:
      `If ${parent} is the larger topic, ${termText.toLowerCase()} is one piece you would point to when explaining how the larger idea works in practice.`,
    safety_note: null
  };
}
