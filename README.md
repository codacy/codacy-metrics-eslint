[![Codacy Badge](https://api.codacy.com/project/badge/Grade/e09ea1ceddb5453abb709b0e147779f1)](https://www.codacy.com/gh/codacy/codacy-metrics-eslint?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=codacy/codacy-metrics-eslint&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/e09ea1ceddb5453abb709b0e147779f1)](https://www.codacy.com/gh/codacy/codacy-metrics-eslint?utm_source=github.com&utm_medium=referral&utm_content=codacy/codacy-metrics-eslint&utm_campaign=Badge_Coverage)

# Codacy Metrics Eslint

## Usage

You can create the docker by doing:

```bash
npm run dockerBuild
```

The docker is ran with the following command:

```bash
docker run -it -v $srcDir:/src  <DOCKER_NAME>:<DOCKER_VERSION>
docker run -it -v $PWD/src/test/resources:/src codacy/codacy-metrics-eslint:latest
```

## Test

Before running the tests, you need to install the dependencies:

```bash
npm install
```

Then you can run tests using:

```bash
npm test
```

### codacy-plugins-test

We use [codacy-plugins-test](https://github.com/codacy/codacy-plugins-test) to run integration tests
in our tools. After downloading the binary and creating the docker image you can run:

```bash
codacy-plugins-test metrics codacy-metrics-eslint
```

## What is Codacy

[Codacy](https://www.codacy.com/) is an Automated Code Review Tool that monitors your technical debt, helps you improve your code quality, teaches best practices to your developers, and helps you save time in Code Reviews.

### Among Codacy’s features

- Identify new Static Analysis issues
- Commit and Pull Request Analysis with GitHub, BitBucket/Stash, GitLab (and also direct git repositories)
- Auto-comments on Commits and Pull Requests
- Integrations with Slack, HipChat, Jira, YouTrack
- Track issues in Code Style, Security, Error Proneness, Performance, Unused Code and other categories

Codacy also helps keep track of Code Coverage, Code Duplication, and Code Complexity.

Codacy supports PHP, Python, Ruby, Java, JavaScript, and Scala, among others.

### Free for Open Source

Codacy is free for Open Source projects.
