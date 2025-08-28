# Witnesses of the Restoration

[Witnesses of the Restoration](https://witnessesoftherestoration.com) provides a simple timeline of events for the Restoration of the Church of Jesus Christ of Latter-day Saints, all backed by links to primary account sources. It is a way for the actual witnesses of the restoration to tell the story, collected in an easy and, hopefull, unbiased way.

There is lot's of information surrounding the history of the LDS church. Some good and some bad. But if we are truly in search for objective truth, then we cannot shy away from things that make us feel uncomfortable. That's why this site strives to provide that information with the appropriate context and sources for individual study.

## Features

- Horizontal timeline with different Restoration events color coded by different categories
  - Filter and see only certain types of events.
  - Zoom to the next or previous event
  - See a summary of each event/quote with ability to go to a page that gives more details
  - Link to the source of the event
- Pages for each category that compile all the events in one place with more information and quotes
- Create user functionality
- Ability to dynamically edit the pages and timeline event items
  - This is probably the best feature in this app
  - Can create arbitrary pages with headers, paragraphs, timelines that link to timeline categories, and lists--either static or ones that link to timeline categories
  - Can also edit Timeline categories
    - Add timeline items to this category with dates, descriptions, and links
    - Change the color of the category, i.e. the color of the bubble of the timeline items in the main timeline
    - Link the timeline items to a page (described above) so that you can go to the page form the timeline item

## What will I do when I have more time?

- Right now you have to be an admin to edit the pages, but I want to add "open source" functionality: any user with an account can contribute to the page and timeline item creation that can be approved or rejected by admins
- Add more settings options to the edit pages: edit color of text, font size, margin, etc.
- Add forgot your password functionality
- Migrate the site to Vercel and PostGres--Right now the site is hosted on aws with a local sqlite file, but it would be a lot easier to deploy to vercel, pointing to an external PostGres or MySql database

## Development

If you want to contribute to this probject, here is some info about the development of the site.

### **Stack**

This app was made using the [T3 Stack](https://create.t3.gg/) (Next.js typescript, tailwind css, TRPC, and prisma sqlite).
It is essentially all typescript--front end and back end. This stack really prides itself on typesafety, so everything from the front end Next.js framework to the sql database is type safe.

### **Folder structure**

Most everything useful is inside of src.

src  
|  
|\_pages -> Where all of the routes live. Each file name is a different route  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(ex. [witnessesoftherestoration/timeline](https://witnessesoftherestoration.com/timeline) pulls from pages/timeline.tsx).  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;For dynamic routes, you put the name in brackets (like \[eventId.tsx\]). Then in the component, you use `useRouter()` to obtain the  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;route name (under `router.query.eventId` in this case)  
|  
|\_server -> This is the back end trpc code lies  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|\_api  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|  
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\_routers -> This is where a new end point will occur. See [TRPC](#trpc) for more info  
|  
|\_styles -> New styles will go in global.css. But this actually rarely should need to happen. See [Tailwind CSS](#tailwind-css) below  
|  
|\_test -> All of the test files will go in here. The testing framework is [Jest](#testing-with-jest)  
|  
|\_utils  
&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;|\_components -> This is where all of the React components go  
&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;|\_services -> This app tries to follow a separation of concerns, which means that React components should just be in charge of UI logic and  
&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;any other model or server logic (api calls) should reside in custom hooks, which are defined in this folder  
&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;|\_types -> Here are all of the type definitions. See [Types](#types) below  
&nbsp;&nbsp;&nbsp;|  
&nbsp;&nbsp;&nbsp;|\_util.ts -> Any util function that is resused can exist here. As we get more of them, it might make sense to make a folder with  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;different files

### **Types**

Like stated above, everything is type safe. Moreover, the whole app shares the same types. With prisma, it makes the most sense to make the database schema the single source of truth for the model classes. This means that most types defined in /src/utils/types are derived from the prisma types that are generated from the databases schemas. You can see this being done through the `satisfies` keyword. Essentially, the types are set up so that whenever a database schema changes in schema.prisma, the compiler will notify of the types in this folder that need to be updated.

Another thing that is defined in these type files is schema validation using [zod](https://zod.dev/). Going off above, the schema validation is based on the prisma types (using the `satisifies` keyword) and the actual types are then inferred from the schema validation. That way, there is truly one source of truth for the types and validation, making things really easy to maintain and change. It actually is pretty cool. If you look at commit `9931477`, I had to update the database schema a bit, and almost all of the changes you see was just me fixing compiler errors. This essentially got rid of any potential bugs that could have arised from this database schema change.

### **Next.js/React with Typescript**

Next.js is a React framework that allows for server side rendering. So knowing React is most of the battle. But adding typescript to the mix does complicate things a bit. Essentially, each component with props needs a type declaration. Just look through /src/utils/components at some components and see how this is done. I usually use the `type` keyword, but you can you `interface` too. I also like using functional components because that is usually the standard.

**Hooks**

Most hooks like `useState` and `useRef` take a type parameter.

- `useState`: The caveat with the type parameter here is that if you do not want the state object to have an undefined state, you must provide a default value
- `useRef`: Put the type of whatever html element will be using the ref and set the default value to null. For example, if the ref will be put on a `div`, then declare like this: `const ref = useRef<HTMLDivElement>(null)`

**Polymorphic components**

Some components have `as` for a property. This allows the component's outer wrapper to be any component--button, div, or another custom component. To implement this, define your props like normal, then but then in this template: `type TextProps<C extends React.ElementType> = PolymorphicComponentProps<C, ButtonProps>` where `ButtonProps` is the props you just defined. Then make `TextProps` the props for your compoent, now it has an "as" property that is polymophic. Just make sure and declare a `const Component = as` inside because variable components must have a capital name.

### **Tailwind CSS**

The styling is all done through [tailwind](https://tailwindui.com/). This is a utility first framework which means that most of the styling can be done using the tailwind css utility classes and there really is no need to create css classes in /src/styles/global.css. The only reason that file has classes in it is because I designed the timeline before I started using tailwind. So don't make any new css classes! The documenation is pretty good at explaining all of the use cases if you just search for what you need.

### **Trpc**

The back end is implented with the [Trpc](https://trpc.io/) framework (still typescript). This essentially allows the routes to be used as functions. This way, type saftey is preserved when making api calls to and from the server.

All of the routes will have their own files in /src/server/api/routers. If you need a new router, then just look at the format of an existing one. Some highlights:

- The name of the route is a property of an object in `createTRPCRouter`. You have to define the access level of the route (`publicProcedure` for public routes, `protectedProcedure` for users that are logged in, and `criticalProcedure` for users that are admins) then if it takes an input, pass in a schema validator (defined in /src/utils/types), then either query or mutation. If it is a GET request, use query. If it is a POST or anything else, use mutation.
- Once you get to query or mutation, the properties `input` and `ctx` are passed in as parameters. `input` is just the input that is defined using the schema validator, and `ctx` is an object that has the user session object and the prisma db object to do database operations on.

### **Prisma**

[Prisma](https://www.prisma.io/) is just an adapter between the database and the typescript allowing the database to essentially have types. You define the database type and schema in /prisma/schema.prisma. When you make an update to a schema, run `npx prisma db push` for the database to see those changes. Then run `npx prisma generate` to update the typescript files for this schema. You can run `npx prisma studio` to run a local server on port 5555 that allows you to inspect the elements of the database.

Prisma does database joins on its own, but it requires some setup. If you need to join two tables, you need one schema (A) to have a field whose type is another schema (B). Then, in schema B, you need two fields: one of type schema A and another that is the same type as the primary key of schema A. The field with type schema A needs to have this tag `@relation(fields: [pageId], references: [id]` where pageId is the field of the primary key of schema A and id is the actual primary key of schema A. You can go look at examples in schema.prisma if that doesn't make sense :)

### **Testing with Jest**

The testing is done in [Jest](https://jestjs.io/). Go ahead and look at the docs and examples of testing already implemented for info. Ideally any new functionality will have an associated test with it.

Existing functionality that needs tests:

- Saving edit page and edit timeline data to the back end
- Login functionality
